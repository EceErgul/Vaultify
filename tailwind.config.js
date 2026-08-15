/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                vault: {
                    dark: "var(--bg-sidebar)",
                    blue: "#63B3ED",
                    red: "#FC8181",
                    yellow: "#FEFCBF",
                    gray: "#F7FAFC",
                    sidebar: "var(--bg-sidebar)",
                    accent: "var(--sidebar-accent)",
                },
                night: {
                    bg: "#1A202C",
                    card: "#2D3748",
                    sidebar: "#171923"
                },
                chart: {
                    borsa: 'var(--color-borsa)',
                    doviz: 'var(--color-doviz)',
                    altin: 'var(--color-altin)',
                    kripto: 'var(--color-kripto)',
                    temettu: 'var(--color-temettu)',

                    maas: 'var(--color-maas)',
                    kira: 'var(--color-kira)',
                    varliklar: 'var(--color-varliklarim)',
                    ikramiye: 'var(--color-ikramiye)',
                    ekis: 'var(--color-ek-is)',
                    miras: 'var(--color-miras)',
                    devlet: 'var(--color-devlet)',
                    gelirDiger: 'var(--color-gelir-diger)',

                    ev: 'var(--color-ev)',
                    market: 'var(--color-market)',
                    giderKira: 'var(--color-gider-kira)',
                    eglence: 'var(--color-eglence)',
                    saglik: 'var(--color-saglik)',
                    ulasim: 'var(--color-ulasim)',
                    taksit: 'var(--color-taksit)',
                    borc: 'var(--color-borc)',
                    fatura: 'var(--color-fatura)',
                    abonelik: 'var(--color-abonelik)',
                    giderDiger: 'var(--color-gider-diger)',
                }
            },
            borderRadius: {
                'v-card': '12px',
            },
            boxShadow: {
                'v-soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }
        },
    },
    plugins: [],
}