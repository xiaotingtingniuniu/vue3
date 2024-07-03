<template>
    <div class="college_detail">
        <div class="video" v-if="contentType === 1">
            <video
                controlsList="nodownload"
                v-if="contentUrl"
                x5-video-player-type="h5-page"
                playsinline="true"
                x5-video-player-fullscreen="true"
                :src="contentUrl"
                id="video"
                controls="controls"
                autoplay="autoplay"
                width="100%"
                :class="{'video_android':!isIos,'nocanplay':!canplay}"
            ></video>

        </div>
        <div class="pdf" id="canvas-box" v-if="contentType === 2">
            <iframe
                style="width:100%;height:100%;"
                :src="pdfSrc"
                ref="pdfViewr"
                allowfullscreen
                webkitallowfullscreen
            >
            </iframe>
            <!-- <template v-for="item in pageNum" :key="item">
                <canvas :id="`pdf-canvas-${item}`" :data-ind="item" :load="false" class="pdf-page" />
            </template> -->
        </div>
        <div class="pdf" v-if="contentType === 3">
            <audio :src="audioUrl" autoplay id='audio'/>
            <img v-if="playStatus" src="../../assets/play.gif" @click="changeAudio" class="audio"/>
            <img v-else src="../../assets/pause.png" @click="changeAudio" class="audio"/>
            <iframe
                style="width:100%;height:100%;"
                :src="pdfSrc"
                ref="pdfViewr"
                allowfullscreen
                webkitallowfullscreen
            >
            </iframe>
            <!-- <template v-for="item in pageNum" :key="item">
                <canvas :id="`pdf-canvas-${item}`" class="pdf-page" />
            </template> -->
        </div>
        <div class="url" v-if="contentType === 4">

        </div>
    </div>
</template>

<script>

import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { appBridge } from '@/utils/bridge'
import { collegeDetail } from '@/api/college'
import { useRoute } from 'vue-router'
// const PDF = require('pdfjs-dist')
// PDF.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
export default defineComponent({
    setup () {
        const route = useRoute()
        let isIos
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            isIos = true
        } else if (/(Android)/i.test(navigator.userAgent)) {
            // Android终端
            // this.profileId=str
            isIos = false
        }
        const dataState = reactive({
            id: route.query.id,
            videoUrl: '',
            // pdfUrl: '/hcpdf' + '/hsh_gzt_s3_test/20220113102733aws-sdk-java-dg-v1.pdf',
            loading: false,
            pageNum: 0,
            pdfCtx: null,
            finished: false,
            contentType: '',
            contentUrl: '',
            playStatus: false,
            audioUrl: '',
            canplay: false,
            isIos,
            timer: null,
            newUrl: '',
            // /hcpdf/hsh_guizhu_s3_test/2022050609414185256.pdf
            // http://testrgw.hengchang6.com/hsh_guizhu_s3_test/2022050609414185256.pdf
            pdfSrc: ''
        })
        const pdfBaseUrl = '/pdfjs/web/viewer.html?file='
        onMounted(() => {
            getcollegeDetail()
            dataState.timer = setInterval(function () {
                if (document.readyState === 'complete') {
                    dataState.canplay = true
                    clearInterval(dataState.timer)
                }
            }, 1000)
        })
        const aa = () => {
            const vdo = document.getElementById('video')
            vdo.addEventListener('webkitfullscreenchange', function (e) {
                if (!document.webkitIsFullScreen) {
                    var json = {
                        type: 1
                    }
                    appBridge('showTitle', json)
                } else {
                    json = {
                        type: 0
                    }
                    appBridge('showTitle', json)
                }
            })
        }

        const getcollegeDetail = async () => {
            const res = await collegeDetail({
                id: dataState.id
            })
            if (res.code === '200') {
                var type = process.env.NODE_ENV !== 'production'
                dataState.contentType = res.data.contentType
                dataState.contentUrl = res.data.contentUrl
                if (res.data.contentType === 1) {
                    setTimeout(function () {
                        document.getElementById('video').play()
                        aa()
                    }, 100)
                } else if (res.data.contentType === 2) {
                    const url = res.data.contentUrl
                    if (type) {
                        dataState.newUrl = url.replace(/http:\/\/testrgw.hengchang6.com/, '/hcpdf')
                    } else {
                        dataState.newUrl = url.replace(/http:\/\/pbsrgw.hengchang6.com/, '/hcpdf')
                    }
                }
                if (res.data.contentType === 3) {
                    dataState.audioUrl = res.data.audioUrl
                    const url = res.data.contentUrl
                    if (type) {
                        dataState.newUrl = url.replace(/http:\/\/testrgw.hengchang6.com/, '/hcpdf')
                    } else {
                        dataState.newUrl = url.replace(/http:\/\/pbsrgw.hengchang6.com/, '/hcpdf')
                    }
                    // resolvePdf()
                    setTimeout(function () {
                        document.getElementById('audio').play()
                        if (!document.getElementById('audio').paused) {
                            dataState.playStatus = true
                        }
                    }, 1000)
                }
                if (res.data.contentType === 4) {
                    const url = res.data.contentUrl
                    window.location.replace(url)
                }
                dataState.pdfSrc = pdfBaseUrl + dataState.newUrl
            }
        }
        // const resolvePdf = () => {
        //     const loadingTask = PDF.getDocument(dataState.newUrl)
        //     loadingTask.promise.then(pdf => {
        //         dataState.pdfCtx = pdf
        //         dataState.pageNum = pdf.numPages
        //         nextTick(() => {
        //             renderPdf(1)
        //         })
        //     })
        // }
        // const renderPdf = async (num = 1) => {
        //     dataState.pdfCtx.getPage(num).then(page => {
        //         const canvas = document.getElementById(`pdf-canvas-${num}`)
        //         const ctx = canvas.getContext('2d')
        //         const viewport = page.getViewport({ scale: 1 })
        //         // 画布大小,默认值是width:300px,height:150px
        //         var CSS_UNITS = 196.0 / 72.0
        //         canvas.height = viewport.height * CSS_UNITS
        //         canvas.width = viewport.width * CSS_UNITS
        //         // 画布的dom大小, 设置移动端,宽度设置铺满整个屏幕
        //         const clientWidth = document.body.clientWidth
        //         canvas.style.width = clientWidth + 'px'
        //         // 根据pdf每页的宽高比例设置canvas的高度
        //         canvas.style.height = clientWidth * (viewport.height / viewport.width) + 'px'

        //         page.render({
        //             transform: [CSS_UNITS, 0, 0, CSS_UNITS, 0, 0],
        //             canvasContext: ctx,
        //             viewport
        //         })
        //         if (num < dataState.pageNum) {
        //             nextTick(() => {
        //                 renderPdf(num + 1)
        //             })
        //         } else {
        //             // emit('onRendered')
        //         }
        //     })
        // }
        const changeAudio = () => {
            // document.getElementById('audio').load()
            if (document.getElementById('audio').paused) {
                document.getElementById('audio').play()
                dataState.playStatus = true
            } else {
                document.getElementById('audio').pause()
                dataState.playStatus = false
            }

            // document.getElementById('audio').volume = 0
        }
        return {
            ...toRefs(dataState),
            changeAudio
        }
    }

})

</script>
<style lang="scss" scoped>
.college_detail{
    // position: relative;
    width:100vw;
    height:100vh;
    background: #ddd;
    .video{
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        width:750px;
        margin:auto;
        video{
            width:750px;
        }
    }
    .pdf{
        overflow-y: scroll;
        background: #ddd;
        width:750px;
        height: 100vh;
        .audio{
            position: fixed;
            top:90px;
            right:40px;
            height: 40px;
            width: 40px;
        }
    }
}
// .video_android::-webkit-media-controls-fullscreen-button {
//     display: none;
// }
.nocanplay{
    display: none;
}
</style>
