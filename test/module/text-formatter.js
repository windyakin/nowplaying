const Mocha = require('mocha');
const Chai = require('chai');

const assert = Chai.assert;

const TextFormatter = require('../../src/module/text-formatter.js');

Mocha.describe('Textformatter', () => {
  Mocha.it('convert short title and artist to status', () => {
    const playing = JSON.stringify({ title: 'HAPPY PARTY TRAIN', artist: 'Aqours' });
    const expectedStatusEmoji = ':headphones:';
    const expectedStatusText = 'HAPPY PARTY TRAIN / Aqours';
    assert.equal(TextFormatter.playing2Status(playing).status_emoji, expectedStatusEmoji);
    assert.equal(TextFormatter.playing2Status(playing).status_text, expectedStatusText);
  });

  Mocha.it('status cut down to 100 characters when parse too long title and artist', () => {
    const playing = JSON.stringify({
      title: '夢で夜空を照らしたい (TVサイズ)',
      artist: '高海千歌(CV/伊波杏樹), 桜内梨子(CV.逢田梨香子), 渡辺曜(CV.斉藤朱夏), 津島善子(CV.小林愛香), 国木田花丸(CV.高槻かなこ), 黒澤ルビィ(CV.降幡愛)',
    });
    const expectedStatusEmoji = ':headphones:';
    const expectedStatusText = '夢で夜空を照らしたい (TVサイズ) / 高海千歌(CV/伊波杏樹), 桜内梨子(CV.逢田梨香子), 渡辺曜(CV.斉藤朱夏), 津島善子(CV.小林愛香), 国木田花丸(CV.高槻かなこ),...';
    assert.equal(TextFormatter.playing2Status(playing).status_emoji, expectedStatusEmoji);
    assert.equal(TextFormatter.playing2Status(playing).status_text, expectedStatusText);
    assert.equal(TextFormatter.playing2Status(playing).status_text.length, 100);
  });
});
