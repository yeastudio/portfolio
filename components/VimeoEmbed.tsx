export default function VimeoEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="relative w-full aspect-video">
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
        className="absolute inset-0 w-full h-full"
        style={{ border: 0 }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Vimeo video player"
      />
    </div>
  );
}
