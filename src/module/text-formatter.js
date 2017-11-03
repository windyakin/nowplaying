module.exports = class TextFormatter {
  static playing2Status(json) {
    const playing = JSON.parse(json);
    if (!(playing.title && playing.artist)) {
      return null;
    }
    let status = `${playing.title} / ${playing.artist}`;
    if (status.length > 100) {
      status = `${status.slice(0, 97)}...`;
    }
    return { status_emoji: ':headphones:', status_text: status };
  }
};
