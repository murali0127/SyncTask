

export default {
      content: [
            './index.html',
            './src/**/*.{js,jsx,ts,tsx}'
      ],
      theme: {
            extend: {
                  fontFamily: {
                        // use these like `font-plus-jakarta`, `font-mogra`, `font-dm-mono`
                        'plus-jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
                        mogra: ['Mogra', 'cursive'],
                        syne: ['Syne', 'sans-serif'],
                        'dm-mono': ['"DM Mono"', 'monospace'],
                        inter: ['Inter', 'system-ui', 'sans-serif']
                  }
            }
      },
      plugins: []
}
