/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',

    // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
    // trailingSlash: true,

    // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
    // skipTrailingSlashRedirect: true,

    // Optional: Change the output directory `out` -> `dist`
    distDir: 'dist',
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        // ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true
    },
    experimental: {
        reactCompiler: true,
    },
}

module.exports = nextConfig