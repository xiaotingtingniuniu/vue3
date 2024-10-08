module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/vue3-essential', '@vue/standard'],
    globals: {
        defineProps: true,
        defineEmits: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-unused-vars': 'off',
        'no-tabs': 'off',
        camelase: [0, { peoperties: 'always' }],
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
