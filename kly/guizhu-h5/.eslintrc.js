module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/vue3-essential', '@vue/standard'],
    globals: {
        defineProps: true,
        defineEmits: true,
        defineExpose: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'public/pdf.worker.js': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        indent: ['error', 4],
        'vue/html-indent': [
            'error',
            4,
            {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: []
            }
        ],
        'space-before-function-paren': 0
    }
}
