// types/mux-player.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'mux-player': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        'playback-id'?: string
        'metadata-video-title'?: string
        'metadata-viewer-user-id'?: string
        'stream-type'?: string
        'env-key'?: string
        controls?: boolean
        autoplay?: boolean
        muted?: boolean
        loop?: boolean
        preload?: 'none' | 'metadata' | 'auto'
        poster?: string
        'prefer-cmcd'?: string
        'disable-cookies'?: boolean
        'cross-origin'?: 'anonymous' | 'use-credentials'
        'player-software-name'?: string
        'player-software-version'?: string
        'beacon-collection-domain'?: string
        'custom-domain'?: string
      },
      HTMLElement
    >
  }
}
