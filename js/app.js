/* ============================================
   Naval Books Tracker — Application Logic
   Optimized for performance, error handling & accessibility
   ============================================ */

/* ---- Constants ---- */
const STORAGE_KEY = 'naval_books_v1';
const READING_KEY = 'naval_reading_v1';
const DAILY_QUOTES_KEY = 'naval_daily_quotes_v1';
const QUOTE_SEEN_KEY = 'naval_quote_seen_v1';
const QUOTE_TRANSLATION_CACHE_KEY = 'naval_quote_translation_cache_v1';
const MONTHS_CN = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const API_TIMEOUT = 8000; // 8 second timeout for external API calls

/* ---- Book Data ---- */
const categories = [
  {
    id: 'nonfiction', name: '📖 非虛構類', subtitle: '財富·認知·歷史·科學',
    color: '#4a9eff',
    books: [
      { id: 'b01', title: '無窮的開始', author: '戴維·多伊奇', rating: 8.8, difficulty: 2, quote: '解釋一切的開端', desc: '多伊奇以深刻的洞察力探討了人類知識的無限可能，從科學、哲學到人工智能，為我們揭示了一個無窮擴展的知識宇宙。', cover_url: 'images/b01.jpg' },
      { id: 'b02', title: '人類簡史', author: '尤瓦爾·赫拉利', rating: 9.1, difficulty: 2, quote: '從動物到上帝', desc: '赫拉利以宏大的視角回顧了人類從認知革命到科學革命的歷史，揭示了金錢、帝國和宗教如何塑造了今日世界。', cover_url: 'images/b02.jpg' },
      { id: 'b03', title: '理性樂觀派', author: '馬特·里德利', rating: 7.8, difficulty: 2, quote: '進步來自交換', desc: '里德利用大量數據證明人類社會在每一個維度都在進步，樂觀不是天真，而是基於歷史事實的理性判斷。', cover_url: 'images/b03.jpg' },
      { id: 'b04', title: '基因組：生命之書23章', author: '馬特·里德利', rating: 8.5, difficulty: 3, quote: '人類的基因藍圖', desc: '通過23對染色體的故事，里德利帶領我們探索基因如何影響人類的命運、性格和歷史。', cover_url: 'images/b04.jpg' },
      { id: 'b05', title: '紅色皇后：性與人性的進化', author: '馬特·里德利', rating: 8.1, difficulty: 3, quote: '性作為進化驅動力', desc: '以「紅色皇后」理論探討性選擇如何推動物種進化，揭示了人性深處的進化密碼。', cover_url: 'images/b05.jpg' },
      { id: 'b06', title: '美德的起源', author: '馬特·里德利', rating: 8.0, difficulty: 3, quote: '人性與協作的進化', desc: '從生物學和人類學角度探討了人類美德、信任和合作的進化根源，顛覆了「人性本惡」的傳統觀念。', cover_url: 'images/b06.jpg' },
      { id: 'b07', title: '自下而上：萬物進化簡史', author: '馬特·里德利', rating: 8.2, difficulty: 3, quote: '從宇宙到意識的進化', desc: '從宇宙、生命、文化到經濟，里德利論證了一切複雜系統都是由下而上演化而成，而非自上而下設計。', cover_url: 'images/b07.jpg' },
      { id: 'b08', title: '非對稱風險', author: '納西姆·塔勒布', rating: 8.1, difficulty: 4, quote: '風險共擔是核心', desc: '塔勒布探討了風險、責任與決策之間的深刻關係，強調「沒有風險共擔就沒有進步」的核心思想。', cover_url: 'images/b08.jpg' },
      { id: 'b09', title: '黑天鵝', author: '納西姆·塔勒布', rating: 8.3, difficulty: 4, quote: '不可預測的極端事件', desc: '塔勒布提出「黑天鵝」概念，揭示那些罕見但影響巨大的極端事件如何塑造了我們的歷史和世界。', cover_url: 'images/b09.jpg' },
      { id: 'b10', title: '反脆弱', author: '納西姆·塔勒布', rating: 8.6, difficulty: 4, quote: '從波動中獲益', desc: '塔勒布提出了「反脆弱」的概念——那些在混亂和壓力中反而變得更好的系統，教你如何在不确定性中受益。', cover_url: 'images/b10.jpg' },
      { id: 'b11', title: '隨機漫步的傻瓜', author: '納西姆·塔勒布', rating: 8.0, difficulty: 3, quote: '運氣與隨機性', desc: '揭示金融市場和生活中隨機性與運氣的作用，教我們如何區分運氣和技巧。', cover_url: 'images/b11.jpg' },
      { id: 'b12', title: '肥尾效應', author: '納西姆·塔勒布', rating: 7.1, difficulty: 4, quote: '極端事件的概率', desc: '塔勒布深入探討了統計學中「肥尾」現象，解釋為什麼極端事件比我們想像的更頻繁發生。', cover_url: 'images/b12.jpg' },
      { id: 'b13', title: '塔勒布智慧箴言錄', author: '納西姆·塔勒布', rating: 8.2, difficulty: 3, quote: '反脆弱的智慧', desc: '塔勒布最具代表性的思想濃縮，以犀利的箴言形式呈現他對風險、隨機性和生活的獨特見解。', cover_url: 'images/b13.jpg' },
      { id: 'b14', title: '窮查理寶典', author: '查理·芒格', rating: 8.6, difficulty: 3, quote: '多元思維模型', desc: '收錄了查理·芒格一生的智慧，從心理學、經濟學到物理學，教你用多元思維模型做出更好的決策。', cover_url: 'images/b14.jpg' },
      { id: 'b15', title: '主權個人', author: '詹姆斯·戴爾·戴維森', rating: 7.0, difficulty: 4, quote: '信息時代的新人類', desc: '預測了信息時代將如何瓦解民族國家體系，催生全新的社會結構和個體自由形態。', cover_url: 'images/b15.jpg' },
      { id: 'b16', title: '合作的進化', author: '羅伯特·阿克塞爾羅德', rating: 8.4, difficulty: 3, quote: '重複囚徒困境', desc: '通過著名的「囚徒困境」電腦模擬，證明了合作如何在沒有中央權威的情況下自發湧現和進化。', cover_url: 'images/b16.jpg' },
      { id: 'b17', title: '費曼講物理：入門', author: '理查德·費曼', rating: 9.1, difficulty: 2, quote: '物理學的樂趣', desc: '費曼以生動幽默的語言講述物理學的基本概念，讓普通人也能感受到物理學的美麗與樂趣。', cover_url: 'images/b17.jpg' },
      { id: 'b18', title: '費曼物理學講義', author: '理查德·費曼', rating: 9.5, difficulty: 3, quote: '深度理解物理', desc: '費曼在加州理工學院的經典物理學講義，被譽為20世紀最偉大的物理學教科書。', cover_url: 'images/b18.jpg' },
      { id: 'b19', title: '萬物解釋者', author: '蘭道爾·門羅', rating: 8.2, difficulty: 1, quote: '複雜事物的簡單解釋', desc: '用最簡單的詞彙和精美的圖解，解釋地球上最複雜的事物和概念，適合所有年齡層。', cover_url: 'images/b19.jpg' },
      { id: 'b20', title: '趣味物理尋答集', author: '劉易斯·愛潑斯坦', rating: 8.5, difficulty: 1, quote: '物理思維訓練', desc: '以生活中的趣味問題為切入點，引導讀者用物理思維去思考和解答日常謎題。', cover_url: 'images/b20.jpg' },
      { id: 'b21', title: '七堂極簡物理課', author: '卡洛·羅韋利', rating: 8.6, difficulty: 2, quote: '詩意地理解物理', desc: '用詩意的語言和極簡的篇幅，為讀者勾勒出現代物理學的七個核心概念，優美而深刻。', cover_url: 'images/b21.jpg' },
      { id: 'b22', title: '現實不似你所見', author: '卡洛·羅韋利', rating: 8.8, difficulty: 3, quote: '量子引力的詩意', desc: '帶領讀者探索量子引力的奧秘，挑戰我們對時空和現實的傳統認知。', cover_url: 'images/b22.jpg' },
      { id: 'b23', title: '歷史的教訓', author: '威爾·杜蘭特', rating: 8.3, difficulty: 2, quote: '文明興衰的啟示', desc: '杜蘭特夫婦從歷史的宏大敘事中提煉出關於人性、文明和社會的永恆教訓。', cover_url: 'images/b23.jpg' },
      { id: 'b24', title: '技術革命與金融資本', author: '卡蘿塔·佩蕾絲', rating: 8.0, difficulty: 4, quote: '技術革命的動力學', desc: '分析了技術革命與金融資本之間的反覆循環關係，揭示了經濟發展的深層規律。', cover_url: 'images/b24.jpg' },
      { id: 'b25', title: '策略家的博弈', author: '阿維納什·迪克西特', rating: 8.2, difficulty: 4, quote: '博弈論與策略思維', desc: '用博弈論的思維框架分析日常生活中的策略互動，教你如何在競爭與合作中做出最佳選擇。', cover_url: 'images/b25.jpg' },
      { id: 'b26', title: '生命的躍升', author: '尼克·萊恩', rating: 8.7, difficulty: 3, quote: '生命進化的關鍵時刻', desc: '揭示了生命進化史上十個最偉大的發明，從DNA到光合作用，從意識到死亡，展現生命的神奇。', cover_url: 'images/b26.jpg' }
    ]
  },
  {
    id: 'fiction', name: '✦ 虛構文學類', subtitle: '科幻·奇幻·文學經典',
    color: '#c07aff',
    books: [
      { id: 'c01', title: '你一生的故事', author: '特德·姜', rating: 8.7, difficulty: 2, quote: '預知未來的代價', desc: '如果能夠預知未來，你還會做出同樣的選擇嗎？特德·姜以獨特的語言學視角探索自由意志與宿命的命題。', cover_url: 'images/c01.jpg' },
      { id: 'c02', title: '三體', author: '劉慈欣', rating: 8.8, difficulty: 3, quote: '黑暗森林法則', desc: '劉慈欣的史詩級科幻巨作，描繪了人類與三體文明之間的接觸與對抗，重新定義了中國科幻文學的高度。', cover_url: 'images/c02.jpg' },
      { id: 'c03', title: '沙丘', author: '弗蘭克·赫伯特', rating: 8.3, difficulty: 3, quote: '權力與信仰的史詩', desc: '在浩瀚的沙漠星球上，關於權力、信仰、生態和命運的史詩故事，科幻文學史上不朽的經典。', cover_url: 'images/c03.jpg' },
      { id: 'c04', title: '指環王', author: 'J.R.R.托爾金', rating: 9.0, difficulty: 3, quote: '中土世界的傳奇', desc: '托爾金創造的中土世界史詩，講述了平凡的力量如何改變世界的命運，現代奇幻文學的奠基之作。', cover_url: 'images/c04.jpg' },
      { id: 'c05', title: '銀河系漫遊指南', author: '道格拉斯·亞當斯', rating: 8.0, difficulty: 2, quote: '生命、宇宙與一切的終極答案', desc: '史上最幽默的科幻小說，英國式幽默與科幻的完美結合，告訴你生命、宇宙和一切的答案是「42」。', cover_url: 'images/c05.jpg' },
      { id: 'c06', title: '源泉', author: '安·蘭德', rating: 8.6, difficulty: 4, quote: '個人主義的贊歌', desc: '以天才建築師為主角，歌頌個人創造力和獨立精神，是安·蘭德客觀主義哲學的文學宣言。', cover_url: 'images/c06.jpg' },
      { id: 'c07', title: '阿特拉斯聳聳肩', author: '安·蘭德', rating: 8.1, difficulty: 4, quote: '創造者的價值', desc: '當社會的創造者們集體罷工，世界會變成什麼樣？一部關於資本主義與個人主義的宏大寓言。', cover_url: 'images/c07.jpg' },
      { id: 'c08', title: '悉達多', author: '赫爾曼·黑塞', rating: 9.1, difficulty: 2, quote: '成為自己的道路', desc: '古印度貴族子弟悉達多求道的一生，黑塞以詩意的筆觸探討了自我、覺悟與生命的真諦。', cover_url: 'images/c08.jpg' }
    ]
  },
  {
    id: 'philosophy', name: '🧘 哲學與靈性類', subtitle: '冥想·存在·東方智慧',
    color: '#3dd68c',
    books: [
      { id: 'd01', title: '沉思錄', author: '馬可·奧勒留', rating: 8.6, difficulty: 2, quote: '斯多葛主義的實踐', desc: '羅馬皇帝馬可·奧勒留的個人哲學筆記，斯多葛主義的經典之作，教人如何在混亂中保持內心的平靜。', cover_url: 'images/d01.jpg' },
      { id: 'd02', title: '生命之書', author: '克里希那穆提', rating: 8.9, difficulty: 3, quote: '觀察與覺察', desc: '克里希那穆提關於覺察、自由與真實的每日教誨，引導讀者超越思維的限制，覺悟生命的本質。', cover_url: 'images/d02.jpg' },
      { id: 'd03', title: '清醒地活', author: '邁克爾·辛格', rating: 8.4, difficulty: 3, quote: '超越你的頭腦', desc: '引領讀者覺察內心的聲音，超越思維的束縛，找到真正的自我和內在的平靜。', cover_url: 'images/d03.jpg' },
      { id: 'd04', title: '當下的力量', author: '埃克哈特·托利', rating: 8.3, difficulty: 3, quote: '此刻的覺醒', desc: '教導人們如何擺脫過去和未來的困擾，專注於當下的力量，實現心靈的覺醒與轉化。', cover_url: 'images/d04.jpg' },
      { id: 'd05', title: '新世界：靈性的覺醒', author: '埃克哈特·托利', rating: 8.6, difficulty: 3, quote: '揚升的意識', desc: '超越自我（ego）的限制，進入一個全新的意識層次，為個人和世界帶來真正的轉變。', cover_url: 'images/d05.jpg' },
      { id: 'd06', title: '傑德·麥肯納靈性開悟三部曲', author: '傑德·麥肯納', rating: 8.4, difficulty: 4, quote: '開悟的真相', desc: '以毫不妥協的態度揭開靈性開悟的神秘面紗，直指真相，打破一切靈性幻象。', cover_url: 'images/d06.jpg' },
      { id: 'd07', title: '道德經', author: '老子', rating: 9.2, difficulty: 2, quote: '道法自然', desc: '中國哲學的源頭，短短五千言濃縮了老子對天道、人道和治道的深邃智慧，影響了東方文明兩千年。', cover_url: 'images/d07.jpg' },
      { id: 'd08', title: '薄伽梵歌', author: '薄伽梵歌', rating: 8.6, difficulty: 3, quote: '行動的哲學', desc: '印度最偉大的哲學史詩之一，以戰場對話的形式探討了責任、行動與解脫的深刻命題。', cover_url: 'images/d08.jpg' }
    ]
  },
  {
    id: 'others', name: '🌟 其他推薦', subtitle: '人物傳記·學習方法·思維模型',
    color: '#f5a623',
    books: [
      { id: 'e01', title: '愛因斯坦傳', author: '沃爾特·艾薩克森', rating: 8.6, difficulty: 2, quote: '好奇心的力量', desc: '艾薩克森以細膩的筆觸還原了愛因斯坦的傳奇一生，展現了好奇心和創造力如何改變了人類對宇宙的認知。', cover_url: 'images/e01.jpg' },
      { id: 'e02', title: '富蘭克林傳', author: '沃爾特·艾薩克森', rating: 8.5, difficulty: 2, quote: '自我塑造的典範', desc: '美國國父富蘭克林從印刷學徒到偉大科學家、政治家、發明家的傳奇人生，自我完善的典範。', cover_url: 'images/e02.jpg' },
      { id: 'e03', title: '學習之道', author: '芭芭拉·奧克利', rating: 8.3, difficulty: 2, quote: '從思維模式到學習方法', desc: '結合認知科學和實踐經驗，揭示了高效學習的秘密，教你如何掌握任何一門學科。', cover_url: 'images/e03.jpg' },
      { id: 'e04', title: '刻意練習', author: '安德斯·艾利克森', rating: 7.8, difficulty: 2, quote: '精通的路徑', desc: '顛覆「天賦決定成就」的傳統觀念，用大量研究證明刻意練習才是通往卓越的唯一道路。', cover_url: 'images/e04.jpg' },
      { id: 'e05', title: '思考，快與慢', author: '丹尼爾·卡尼曼', rating: 8.1, difficulty: 3, quote: '雙系統思維', desc: '諾貝爾獎得主卡尼曼揭示了人類思維的兩個系統——直覺與理性，以及它們如何影響我們的判斷與決策。', cover_url: 'images/e05.jpg' },
      { id: 'e06', title: '影響力', author: '羅伯特·西奧迪尼', rating: 8.6, difficulty: 3, quote: '說服的心理學', desc: '經典的說服心理學著作，揭示了六大影響力原理，教你如何識別和運用它們。', cover_url: 'images/e06.jpg' },
      { id: 'e07', title: '學會提問', author: '尼爾·布朗', rating: 8.2, difficulty: 2, quote: '批判性思維入門', desc: '系統地介紹了批判性思維的核心理念和方法，幫助讀者成為更獨立、更有洞察力的思考者。', cover_url: 'images/e07.jpg' }
    ]
  }
];

/* ---- Fallback Quotes ---- */
const fallbackQuotes = [
  { id: 'fb-01', content: 'We suffer more often in imagination than in reality.', translation: '我们往往更多地受苦于想象，而不是现实。', author: 'Seneca', portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Portrait_of_Seneca_%28y_%C3%B3leo_sobre_lienzo%2C_1675-1715%29.jpg/220px-Portrait_of_Seneca_%28y_%C3%B3leo_sobre_lienzo%2C_1675-1715%29.jpg' },
  { id: 'fb-02', content: 'The happiness of your life depends upon the quality of your thoughts.', translation: '你一生的幸福，取决于你思想的质量。', author: 'Marcus Aurelius', portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Marcus_Aurelius_Glyptothek_Munich.jpg/220px-Marcus_Aurelius_Glyptothek_Munich.jpg' },
  { id: 'fb-03', content: 'No man is free who is not master of himself.', translation: '不能掌握自己的人，谈不上自由。', author: 'Epictetus', portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Epicteti_Enchiridion_Latinis_versibus_adumbratum_%28Oxford_1715%29_frontispiece.jpg/220px-Epicteti_Enchiridion_Latinis_versibus_adumbratum_%28Oxford_1715%29_frontispiece.jpg' },
  { id: 'fb-04', content: 'He who has a why to live can bear almost any how.', translation: '知道为何而活的人，几乎可以承受任何一种生活方式。', author: 'Friedrich Nietzsche', portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/220px-Nietzsche187a.jpg' },
  { id: 'fb-05', content: 'The unexamined life is not worth living.', translation: '未经省察的人生，不值得过。', author: 'Socrates', portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Socrate_du_Louvre.jpg/220px-Socrate_du_Louvre.jpg' },
  { id: 'fb-06', content: 'Nature does not hurry, yet everything is accomplished.', translation: '大自然从不匆忙，但一切都能完成。', author: 'Laozi', portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Portrait_of_Laozi_%28Taoism%29.jpg/220px-Portrait_of_Laozi_%28Taoism%29.jpg' },
  { id: 'fb-07', content: 'Knowing yourself is the beginning of all wisdom.', translation: '认识自己，是一切智慧的开端。', author: 'Aristotle', portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Aristotle_Met_03.jpg/220px-Aristotle_Met_03.jpg' },
  { id: 'fb-08', content: 'The whole future lies in uncertainty: live immediately.', translation: '整个未来都在不确定之中，所以请立刻生活。', author: 'Seneca', portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Portrait_of_Seneca_%28y_%C3%B3leo_sobre_lienzo%2C_1675-1715%29.jpg/220px-Portrait_of_Seneca_%28y_%C3%B3leo_sobre_lienzo%2C_1675-1715%29.jpg' },
  { id: 'fb-09', content: 'It is not length of life, but depth of life.', translation: '人生重要的不是长度，而是深度。', author: 'Ralph Waldo Emerson', portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Ralph_Waldo_Emerson_ca1857.jpg/220px-Ralph_Waldo_Emerson_ca1857.jpg' },
  { id: 'fb-10', content: 'The soul becomes dyed with the color of its thoughts.', translation: '灵魂会染上它所思之物的颜色。', author: 'Marcus Aurelius', portrait: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Marcus_Aurelius_Glyptothek_Munich.jpg/220px-Marcus_Aurelius_Glyptothek_Munich.jpg' }
];

/* ---- Global State ---- */
let state = {};
let readingLogs = {};
let quoteRotationTimer = null;
let activeQuoteIndex = 0;
let activeQuoteDeck = [];
let quoteLoadPromise = null;
let calYear = new Date().getFullYear();
let focusAfterPageChange = null; // For focus management

/* ============================================
   Utility Functions
   ============================================ */

function getDefaultState() {
  const s = {};
  categories.forEach(cat => {
    cat.books.forEach(book => {
      s[book.id] = { status: 'unread', progress: 0 };
    });
  });
  return s;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDaySerial() {
  const now = new Date();
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
}

function escapeHTML(text) {
  return String(text).replace(/[&<>"]/g, ch =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]
  );
}

function cleanDisplayName(text) {
  return String(text).replace(/^[^\p{L}\p{N}一-鿿]+/u, '').trim();
}

function getStatusClass(status) {
  if (status === 'done') return 'tag-done';
  if (status === 'reading') return 'tag-reading';
  return 'tag-unread';
}

function getStatusText(status) {
  if (status === 'done') return '已讀';
  if (status === 'reading') return '進行中';
  return '未讀';
}

function stars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function getCoverURL(book) {
  if (!book.cover_url) return null;
  // Use relative paths — works both locally and on GitHub Pages
  return book.cover_url;
}

function getPlaceholderColor(title) {
  const colors = ['#2a3a5a', '#3a2a5a', '#2a5a3a', '#5a3a2a', '#3a4a5a', '#4a3a5a'];
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash += title.charCodeAt(i);
  return colors[hash % colors.length];
}

/* ---- LocalStorage with Error Handling ---- */
function loadJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.warn(`Failed to load ${key} from localStorage:`, e);
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage:`, e);
  }
}

function loadState() {
  const saved = loadJSON(STORAGE_KEY, null);
  state = saved || getDefaultState();
}

function saveState() {
  saveJSON(STORAGE_KEY, state);
}

function loadReadingLogs() {
  readingLogs = loadJSON(READING_KEY, {});
}

function saveReadingLogs() {
  saveJSON(READING_KEY, readingLogs);
}

/* ---- Focus Management (Accessibility) ---- */
function setFocusToElement(el) {
  if (el && el.focus) {
    el.focus({ preventScroll: false });
  }
}

function handlePageTransition(newPageId) {
  // Manage focus when switching pages
  const allPages = ['dashboard', 'category-page', 'calendar-page'];
  allPages.forEach(id => {
    const page = document.getElementById(id);
    if (page) {
      if (id === newPageId) {
        page.classList.remove('hidden');
        page.removeAttribute('aria-hidden');
        // Add entrance animation
        page.classList.remove('page-enter');
        void page.offsetWidth; // Trigger reflow
        page.classList.add('page-enter');
      } else {
        page.classList.add('hidden');
        page.classList.remove('page-enter');
        page.setAttribute('aria-hidden', 'true');
      }
    }
  });

  // Focus the first heading or back button in the new page
  const newPage = document.getElementById(newPageId);
  if (newPage) {
    const focusTarget = newPage.querySelector('h2') || newPage.querySelector('.back-btn');
    if (focusTarget) {
      // Small delay to ensure rendering completes
      setTimeout(() => setFocusToElement(focusTarget), 150);
    }
  }
}

/* ---- encode/decode URL state (fixed for Unicode) ---- */
function saveToURL() {
  try {
    // Fixed: use encodeURIComponent then btoa for Unicode support
    const json = JSON.stringify(state);
    const encoded = btoa(encodeURIComponent(json));
    const url = new URL(window.location.href);
    url.searchParams.set('d', encoded);
    window.history.replaceState({}, '', url.toString());
  } catch (e) {
    console.warn('Failed to save state to URL:', e);
  }
}

function loadFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('d');
    if (encoded) {
      // Fixed: decode using atob then decodeURIComponent
      const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
      if (decoded && typeof decoded === 'object') {
        state = decoded;
        saveState();
      }
    }
  } catch (e) {
    console.warn('Failed to load state from URL:', e);
  }
}

/* ============================================
   Visual Enhancement — Animation Helpers
   ============================================ */

/* ---- Scroll Reveal with IntersectionObserver ---- */
let revealObserver = null;

function initScrollReveal() {
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  // Observe all .reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

/* ---- Stat Counter Animation ---- */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    // Skip the original count-animated items
    if (el.classList.contains('counted')) return;

    const targetText = el.textContent.trim();
    // Only animate pure numbers
    if (/^\d+$/.test(targetText) || /^\d+(\.\d+)?%?$/.test(targetText)) {
      const targetNum = parseFloat(targetText);
      const isPercent = targetText.includes('%');
      const duration = 1200;
      const startTime = performance.now();

      el.classList.add('counted');

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(eased * targetNum);
        el.textContent = currentVal + (isPercent ? '%' : '');
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = targetText;
        }
      }
      requestAnimationFrame(updateCounter);
    }
  });
}

/* ---- Card Mouse Tracking (glow effect) ---- */
function initCardMouseTracking() {
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
}

/* ---- Image Loaded Handler (shimmer removal) ---- */
function initImageLoading() {
  document.querySelectorAll('.book-cover img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
      img.addEventListener('error', () => img.classList.add('loaded'));
    }
  });
}

/* ---- Apply All Animations ---- */
function applyVisualEnhancements() {
  // Add reveal class to category cards
  document.querySelectorAll('.cat-card').forEach(el => el.classList.add('reveal'));
  initScrollReveal();
  animateCounters();
  initCardMouseTracking();
  initImageLoading();
}

/* ---- API helpers with timeout ---- */
async function fetchWithTimeout(url, timeout = API_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
}

/* ============================================
   Book Data Lookups
   ============================================ */

function getBookById(id) {
  for (const cat of categories) {
    const book = cat.books.find(b => b.id === id);
    if (book) return book;
  }
  return null;
}

function getCatColor(bookId) {
  for (const cat of categories) {
    if (cat.books.find(b => b.id === bookId)) return cat.color;
  }
  return '#4a9eff';
}

function getReadingDays(bookId) {
  const log = readingLogs[bookId];
  if (!log) return 0;
  const start = new Date(log.startDate);
  const end = log.endDate ? new Date(log.endDate) : new Date();
  const diff = Math.round((end - start) / 86400000) + 1;
  return Math.max(1, diff);
}

function getCurrentBookState(bookId) {
  return state[bookId] ? { ...state[bookId] } : { status: 'unread', progress: 0 };
}

function ensureBookState(bookId) {
  if (!state[bookId]) state[bookId] = { status: 'unread', progress: 0 };
  return state[bookId];
}

function getActiveReadingEntries() {
  return Object.entries(readingLogs)
    .filter(([, log]) => log && log.startDate && !log.endDate)
    .sort((a, b) => (b[1].startDate || '').localeCompare(a[1].startDate || ''));
}

function getLatestFinishedEntry() {
  return Object.entries(readingLogs)
    .filter(([, log]) => log && log.startDate && log.endDate)
    .sort((a, b) => (b[1].endDate || '').localeCompare(a[1].endDate || ''))[0] || null;
}

/* ============================================
   Quote System
   ============================================ */

function getFallbackQuoteDeck() {
  const daySerial = getDaySerial();
  const deck = [];
  for (let i = 0; i < 5; i++) {
    deck.push(fallbackQuotes[(daySerial + i) % fallbackQuotes.length]);
  }
  return deck;
}

async function fetchQuoteBatchFromAPI(excludeIds) {
  const tags = encodeURIComponent('wisdom|famous-quotes|inspirational');
  const response = await fetchWithTimeout(
    `https://api.quotable.io/quotes/random?limit=8&maxLength=180&tags=${tags}`
  );
  if (!response.ok) throw new Error(`Quote fetch failed: ${response.status}`);
  const data = await response.json();
  const pool = Array.isArray(data) ? data : [data];
  return pool
    .filter(item => item && item._id && item.content && item.author)
    .filter(item => !excludeIds.has(item._id))
    .map(item => ({ id: item._id, content: item.content.trim(), author: item.author.trim() }));
}

async function translateQuoteToChinese(quoteId, text) {
  const cache = loadJSON(QUOTE_TRANSLATION_CACHE_KEY, {});
  if (cache[quoteId]) return cache[quoteId];

  const endpoint = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-CN`;
  const response = await fetchWithTimeout(endpoint);
  if (!response.ok) throw new Error(`Translation fetch failed: ${response.status}`);

  const data = await response.json();
  const translated = data && data.responseData && data.responseData.translatedText
    ? data.responseData.translatedText.trim()
    : '';
  if (!translated) throw new Error('Translation missing');

  cache[quoteId] = translated;
  saveJSON(QUOTE_TRANSLATION_CACHE_KEY, cache);
  return translated;
}

async function buildDailyQuoteDeck() {
  const dateKey = todayStr();
  const cached = loadJSON(DAILY_QUOTES_KEY, null);
  if (cached && cached.date === dateKey && Array.isArray(cached.deck) && cached.deck.length) {
    return cached.deck;
  }

  const seenIds = new Set(loadJSON(QUOTE_SEEN_KEY, []));
  let candidates = [];

  try {
    for (let attempt = 0; attempt < 4 && candidates.length < 5; attempt++) {
      const fresh = await fetchQuoteBatchFromAPI(
        new Set([...seenIds, ...candidates.map(item => item.id)])
      );
      candidates = candidates.concat(fresh);
    }
  } catch (e) {
    console.warn('Quote fetch failed, using fallback:', e.message);
  }

  if (candidates.length < 5) {
    const fallback = getFallbackQuoteDeck();
    saveJSON(DAILY_QUOTES_KEY, { date: dateKey, deck: fallback, source: 'fallback' });
    return fallback;
  }

  const deck = [];
  for (const quote of candidates.slice(0, 5)) {
    let translation = '';
    try {
      translation = await translateQuoteToChinese(quote.id, quote.content);
    } catch (e) {
      translation = '';
    }
    deck.push({ ...quote, translation: translation || quote.content, source: 'quotable' });
    seenIds.add(quote.id);
  }

  saveJSON(QUOTE_SEEN_KEY, Array.from(seenIds).slice(-1800));
  saveJSON(DAILY_QUOTES_KEY, { date: dateKey, deck, source: 'remote' });
  return deck;
}

function renderQuoteSlide(index) {
  const quote = activeQuoteDeck[index];
  const stage = document.getElementById('quote-stage');
  const dots = document.getElementById('quote-dots');
  const portraitEl = document.getElementById('quote-portrait');
  if (!quote || !stage) return;
  activeQuoteIndex = index;

  const textHtml = `
    <div class="quote-copy-block">
      <div class="quote-original">${escapeHTML(quote.content)}</div>
      <div class="quote-translation">${escapeHTML(quote.translation)}</div>
      <div class="quote-author">${escapeHTML(quote.author)}</div>
    </div>`;

  const portraitHtml = quote.portrait
    ? `<div class="quote-portrait-img-wrap"><img class="quote-portrait-img" src="${escapeHTML(quote.portrait)}" alt="${escapeHTML(quote.author)}" loading="lazy"></div>`
    : '';

  stage.style.opacity = '0';
  stage.style.transform = 'translateY(8px)';
  portraitEl.style.opacity = '0';

  setTimeout(() => {
    stage.innerHTML = textHtml;
    portraitEl.innerHTML = portraitHtml;
    stage.style.opacity = '1';
    stage.style.transform = 'translateY(0)';
    portraitEl.style.opacity = '1';
  }, 50);

  if (dots) {
    dots.innerHTML = activeQuoteDeck.map((item, i) =>
      `<button class="quote-dot${i === index ? ' active' : ''}" type="button"
        aria-label="名言 ${i + 1} / ${activeQuoteDeck.length}"
        onclick="showQuoteSlide(${i})"></button>`
    ).join('');
  }
}

function showQuoteSlide(index) {
  if (!activeQuoteDeck.length) return;
  renderQuoteSlide((index + activeQuoteDeck.length) % activeQuoteDeck.length);
}

function startQuoteRotation() {
  if (quoteRotationTimer) clearInterval(quoteRotationTimer);
  if (activeQuoteDeck.length < 2) return;
  quoteRotationTimer = setInterval(() => {
    showQuoteSlide(activeQuoteIndex + 1);
  }, 6000);
}

async function hydrateQuoteHero() {
  const shell = document.getElementById('quote-shell');
  if (!shell) return;

  const cached = loadJSON(DAILY_QUOTES_KEY, null);
  if (!quoteLoadPromise || !cached || cached.date !== todayStr()) {
    quoteLoadPromise = buildDailyQuoteDeck();
  }

  try {
    activeQuoteDeck = await quoteLoadPromise;
  } catch (e) {
    console.warn('Failed to load quotes, using fallback:', e.message);
    activeQuoteDeck = getFallbackQuoteDeck();
  }
  renderQuoteSlide(0);
  startQuoteRotation();
}

/* ============================================
   Category Icons
   ============================================ */

function getCategoryIcon(catId) {
  const icons = {
    nonfiction: '<svg class="cat-symbol" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="icon-nf-a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f3debd"/><stop offset="55%" stop-color="#d3aa74"/><stop offset="100%" stop-color="#8f613f"/></linearGradient><linearGradient id="icon-nf-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff5e5"/><stop offset="100%" stop-color="#d3b089"/></linearGradient></defs><path fill="url(#icon-nf-a)" d="M15 12h23c6.6 0 12 5.4 12 12v24a4 4 0 0 1-5.8 3.6c-2-1-4.1-1.5-6.4-1.5H18a7 7 0 0 1-7-7V19a7 7 0 0 1 7-7"/><path fill="url(#icon-nf-b)" d="M20 18h17c4.4 0 8 3.6 8 8v17.5c-1.6-.6-3.4-1-5.2-1H20z"/><path fill="#8a613e" d="M24 25h14v2.6H24zm0 7h14v2.6H24zm0 7h10v2.6H24z"/></svg>',
    fiction: '<svg class="cat-symbol" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="icon-fi-a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f6e1ff"/><stop offset="55%" stop-color="#c79adf"/><stop offset="100%" stop-color="#7b587f"/></linearGradient><linearGradient id="icon-fi-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff5ff"/><stop offset="100%" stop-color="#d7badf"/></linearGradient></defs><path fill="url(#icon-fi-a)" d="M20 12h18l12 12v20c0 4.4-3.6 8-8 8H20c-4.4 0-8-3.6-8-8V20c0-4.4 3.6-8 8-8"/><path fill="url(#icon-fi-b)" d="M38 12v12h12z"/><path fill="#7e5a81" d="M22 31c3.4-6 13.1-6 16.5 0-3.4 6-13.1 6-16.5 0m8.2-3.1a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2"/></svg>',
    philosophy: '<svg class="cat-symbol" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="icon-ph-a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f7e4c8"/><stop offset="55%" stop-color="#d4b285"/><stop offset="100%" stop-color="#8b6746"/></linearGradient><linearGradient id="icon-ph-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff8ef"/><stop offset="100%" stop-color="#d6c2a3"/></linearGradient></defs><path fill="url(#icon-ph-a)" d="M32 10c9.7 0 17 7.2 17 16 0 4.5-1.8 8-4.8 10.9-2.8 2.7-4.6 6.1-4.6 10.1v1H24.4v-1c0-4-1.9-7.4-4.6-10.1C16.8 34 15 30.5 15 26c0-8.8 7.3-16 17-16"/><path fill="url(#icon-ph-b)" d="M25 48h14v4H25zm-2 6h18v3H23z"/><path fill="#8c6745" d="M26.5 24c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2.5-1.5 4.5-3.5 5.8V35h-6v-5.2c-2-1.3-3.5-3.3-3.5-5.8"/></svg>',
    others: '<svg class="cat-symbol" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="icon-ot-a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f7dfbf"/><stop offset="55%" stop-color="#d8a66c"/><stop offset="100%" stop-color="#8c5c38"/></linearGradient><linearGradient id="icon-ot-b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff6e7"/><stop offset="100%" stop-color="#d9bf9b"/></linearGradient></defs><path fill="url(#icon-ot-a)" d="M32 12l18 9v11c0 10.4-7.6 20-18 22-10.4-2-18-11.6-18-22V21z"/><path fill="url(#icon-ot-b)" d="M32 18l12 6v8c0 7.5-5.3 14.5-12 16-6.7-1.5-12-8.5-12-16v-8z"/><path fill="#8f603d" d="M32 24l1.8 5.4H39l-4.2 3 1.6 5.2-4.4-3.1-4.4 3.1 1.6-5.2-4.2-3h5.2z"/></svg>'
  };
  return icons[catId] || icons.others;
}

/* ============================================
   Book Item Rendering
   ============================================ */

function buildBookItem(book, accentColor) {
  const s = state[book.id] || { status: 'unread', progress: 0 };
  const log = readingLogs[book.id];
  const isReading = !!log && !log.endDate;
  const isDone = !!log && !!log.endDate;
  const readingDays = getReadingDays(book.id);
  const placeholderBg = getPlaceholderColor(book.title);
  const ratingColor = book.rating >= 9 ? '#ff6b35' : book.rating >= 8.5 ? '#e8a040' : book.rating >= 8 ? '#d4a040' : '#a09078';

  let actionsHtml = '';
  if (!log) {
    actionsHtml = `<button class="btn-start-read" onclick="startReading('${book.id}', event)" type="button">開始閱讀</button>`;
  } else if (isReading) {
    actionsHtml = `
      <button class="btn-done-read" onclick="markDone('${book.id}', event)" type="button">標記讀完</button>
      <button class="btn-undo-read" onclick="undoReading('${book.id}', event)" type="button">撤回閱讀</button>
      <div class="reading-info">閱讀中：已讀 <span class="reading-days-badge">${readingDays} 天</span></div>
    `;
  } else if (isDone) {
    actionsHtml = `
      <button class="btn-undo-read" onclick="undoReading('${book.id}', event)" type="button">撤回閱讀</button>
      <div class="reading-info" style="border-left-color:var(--success)">已讀完，共 <span class="reading-days-badge" style="background:var(--success)">${readingDays} 天</span></div>
    `;
  }

  const coverUrl = getCoverURL(book);

  return `
  <div class="book-item" id="item-${book.id}" role="region" aria-label="${escapeHTML(book.title)}">
    <div class="book-header"
      onclick="toggleBook('${book.id}')"
      onkeydown="handleBookKeydown(event, '${book.id}')"
      tabindex="0"
      role="button"
      aria-expanded="false"
      aria-controls="detail-${book.id}">
      <div class="book-cover">
        <div class="book-cover-inner">
          ${coverUrl
            ? `<img id="cover-${book.id}" src="${coverUrl}" alt="《${book.title}》封面" loading="lazy"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
               <div class="cover-placeholder" style="display:none;background:${placeholderBg}" aria-hidden="true">
                 <span>${book.title}</span>
               </div>`
            : `<div class="cover-placeholder" style="display:flex;background:${placeholderBg}" aria-hidden="true">
                 <span>${book.title}</span>
               </div>`
          }
        </div>
      </div>
      <div class="book-info">
        <div class="book-title-row">
          <div class="book-title">${escapeHTML(book.title)}</div>
          <span class="book-rating" style="color:${ratingColor}">⭐ ${book.rating}</span>
        </div>
        <div class="book-author">${escapeHTML(book.author)}</div>
        <div class="book-tags">
          <span class="tag tag-difficulty" aria-label="難度 ${book.difficulty} / 5">${stars(book.difficulty)}</span>
          <span class="tag ${getStatusClass(s.status)} tag-status">${getStatusText(s.status)}</span>
          ${isReading ? '<span class="tag" style="background:#3e2d24;color:#e8d2b3">閱讀中</span>' : ''}
          ${isDone ? '<span class="tag" style="background:#304131;color:#d9ead1">已讀完</span>' : ''}
        </div>
        ${book.desc ? `<div class="book-desc-short">${escapeHTML(book.desc)}</div>` : ''}
        <div class="book-actions-top" id="actions-top-${book.id}">${actionsHtml}</div>
      </div>
      <span class="expand-icon" aria-hidden="true">▼</span>
    </div>
    <div class="book-detail" id="detail-${book.id}" role="region" aria-label="${escapeHTML(book.title)} 詳情">
      <div class="detail-row">
        <span class="detail-label" id="status-label-${book.id}">狀態</span>
        <select class="status-select" aria-labelledby="status-label-${book.id}"
          onchange="updateStatus('${book.id}', this.value)">
          <option value="unread" ${s.status === 'unread' ? 'selected' : ''}>未讀</option>
          <option value="reading" ${s.status === 'reading' ? 'selected' : ''}>進行中</option>
          <option value="done" ${s.status === 'done' ? 'selected' : ''}>已讀</option>
        </select>
      </div>
      <div class="detail-row">
        <span class="detail-label" id="progress-label-${book.id}">進度</span>
        <div class="progress-wrap">
          <input type="range" class="progress-slider" id="slider-${book.id}"
            min="0" max="100" value="${s.progress}"
            aria-labelledby="progress-label-${book.id}"
            aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.progress}"
            oninput="updateProgress('${book.id}', this.value)">
          <span class="progress-pct" id="pct-${book.id}">${s.progress}%</span>
        </div>
      </div>
    </div>
  </div>`;
}

function rerenderBookItem(bookId, keepOpen = true) {
  const cat = categories.find(c => c.books.find(b => b.id === bookId));
  if (!cat) return;
  const book = cat.books.find(b => b.id === bookId);
  const item = document.getElementById('item-' + bookId);
  if (!item) return;

  const newItem = document.createElement('div');
  newItem.innerHTML = buildBookItem(book, cat.color).trim();
  item.replaceWith(newItem.firstElementChild);

  const nextItem = document.getElementById('item-' + bookId);
  if (keepOpen && nextItem) {
    nextItem.classList.add('open');
    const header = nextItem.querySelector('.book-header');
    if (header) header.setAttribute('aria-expanded', 'true');
  }
}

function toggleBook(id) {
  const el = document.getElementById('item-' + id);
  if (!el) return;
  const isOpen = el.classList.toggle('open');
  const header = el.querySelector('.book-header');
  if (header) {
    header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
}

function handleBookKeydown(event, bookId) {
  // Allow keyboard activation with Enter or Space
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleBook(bookId);
  }
}

/* ============================================
   Dashboard
   ============================================ */

function buildDashboard() {
  const totalBooks = categories.reduce((s, c) => s + c.books.length, 0);
  let doneCount = 0, readingCount = 0, totalProgress = 0, startedCount = 0;

  categories.forEach(cat => {
    cat.books.forEach(book => {
      const s = state[book.id] || { status: 'unread', progress: 0 };
      if (s.status === 'done') doneCount++;
      else if (s.status === 'reading') readingCount++;
      if (s.status !== 'unread' || s.progress > 0 || readingLogs[book.id]) startedCount++;
      totalProgress += s.progress;
    });
  });

  const completionPct = totalBooks ? (doneCount / totalBooks) * 100 : 0;
  const startedPct = totalBooks ? (startedCount / totalBooks) * 100 : 0;
  const averageStartedProgress = startedCount ? (totalProgress / startedCount) : 0;

  const activeLog = getActiveReadingEntries()[0] || null;
  const activeBook = activeLog ? getBookById(activeLog[0]) : null;
  const activeDays = activeLog ? getReadingDays(activeLog[0]) : 0;

  const latestFinishedEntry = getLatestFinishedEntry();
  const latestFinishedBook = latestFinishedEntry ? getBookById(latestFinishedEntry[0]) : null;

  const statsGrid = document.getElementById('stats-grid');
  statsGrid.innerHTML = '';

  const dashboard = document.getElementById('dashboard');
  const oldLead = document.getElementById('dashboard-lead');
  if (oldLead) oldLead.remove();

  dashboard.insertAdjacentHTML('afterbegin', `
    <div class="dashboard-lead" id="dashboard-lead">
      <section class="lead-card" aria-label="每日名言">
        <div class="quote-hero">
          <div class="quote-shell" id="quote-shell">
            <div class="quote-portrait" id="quote-portrait"></div>
            <div class="quote-stage">
              <div class="quote-copy-block">
                <div class="quote-original">正在为今天挑选一句值得慢慢读的话。</div>
                <div class="quote-translation">原文与中译会在这里安静出现。</div>
                <div class="quote-author">正在准备</div>
              </div>
            </div>
          </div>
          <div class="quote-footer">
            <div class="quote-dots" id="quote-dots" role="tablist" aria-label="選擇名言"></div>
          </div>
        </div>
        <div class="lead-metrics">
          <div class="lead-pill"><strong>${doneCount}</strong> / ${totalBooks} 已完成</div>
          <div class="lead-pill"><strong>${readingCount}</strong> 本正在讀</div>
          <div class="lead-pill"><strong>${Math.round(startedPct)}%</strong> 已啟動</div>
        </div>
      </section>
      <aside class="focus-card" aria-label="閱讀焦點">
        <div class="focus-label">${activeBook ? '當前焦點' : '下一步'}</div>
        <div class="focus-value">${activeBook ? escapeHTML(activeBook.title) : '挑一本真正想讀的書'}</div>
        <div class="focus-note">${activeBook
          ? `已經連續閱讀 ${activeDays} 天，現在正沉浸在 ${escapeHTML(activeBook.author)} 的文字裡。`
          : '當沒有正在讀的書時，這裡會保持安靜，但不會顯得很空。'}</div>
        <div class="focus-stack">
          <div class="focus-mini">
            <div class="focus-mini-label">最近讀完</div>
            <div class="focus-mini-value">${latestFinishedBook ? escapeHTML(latestFinishedBook.title) : '還沒有完成記錄'}</div>
            <div class="focus-mini-copy">${latestFinishedBook && latestFinishedEntry
              ? `完成日期 ${latestFinishedEntry[1].endDate}`
              : '完成一本書後，這裡會自動承接你的階段成果。'}</div>
          </div>
          <div class="focus-mini">
            <div class="focus-mini-label">推進質量</div>
            <div class="focus-mini-value">${Math.round(averageStartedProgress)}%</div>
            <div class="focus-mini-copy">這個數值只統計已經啟動的書，避免長書單把真實推進感稀釋掉。</div>
          </div>
        </div>
      </aside>
    </div>
  `);

  hydrateQuoteHero();

  statsGrid.innerHTML = `
    <div class="stat-card">
      <div class="progress-ring" role="progressbar" aria-valuenow="${Math.round(completionPct)}" aria-valuemin="0" aria-valuemax="100" aria-label="整體完成率 ${Math.round(completionPct)}%">
        <svg width="120" height="120" aria-hidden="true">
          <circle class="bg" cx="60" cy="60" r="50"/>
          <circle class="fg" cx="60" cy="60" r="50"
            stroke-dasharray="${2 * Math.PI * 50}"
            stroke-dashoffset="${2 * Math.PI * 50 * (1 - completionPct / 100)}"/>
        </svg>
        <span aria-hidden="true">${Math.round(completionPct)}%</span>
      </div>
      <div class="stat-label">完成率</div>
      <div class="stat-sub">按讀完的書來算，更符合首頁總覽的直覺。</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">${totalBooks}</div>
      <div class="stat-label">書單總數</div>
      <div class="stat-sub">你當前收藏和計劃閱讀的全部書。</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--success)">${doneCount}</div>
      <div class="stat-label">已完成</div>
      <div class="stat-sub">已經完成閱讀閉環的書。</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--accent)">${readingCount}</div>
      <div class="stat-label">進行中</div>
      <div class="stat-sub">目前仍在推進中的閱讀項目。</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--accent-warm)">${startedCount}</div>
      <div class="stat-label">已啟動</div>
      <div class="stat-sub">至少開始過一次，不再被未讀項淹沒。</div>
    </div>
  `;

  const catsEl = document.getElementById('categories');
  catsEl.innerHTML = `
    <div class="library-section" style="grid-column:1 / -1">
      <div class="section-head">
        <h2 class="section-title">分類書架</h2>
        <div class="section-copy">每個分類會同時展示完成率、在讀數量和啟動後的推進質量。</div>
      </div>
    </div>
  ` + categories.map(cat => {
    const total = cat.books.length;
    let done = 0, progress = 0, readingNow = 0, started = 0;
    cat.books.forEach(b => {
      const s = state[b.id] || { status: 'unread', progress: 0 };
      if (s.status === 'done') done++;
      if (s.status === 'reading') readingNow++;
      if (s.status !== 'unread' || s.progress > 0 || readingLogs[b.id]) started++;
      progress += s.progress;
    });
    const pct = total ? (done / total) * 100 : 0;
    const momentum = started ? (progress / started) : 0;
    return `
    <div class="cat-card" onclick="openCategory('${cat.id}')" role="button" tabindex="0"
      onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); openCategory('${cat.id}'); }"
      aria-label="${cleanDisplayName(cat.name)}：${done}/${total} 已完成">
      <div class="cat-head">
        <div class="cat-head-left">
          ${getCategoryIcon(cat.id)}
          <h3>${cleanDisplayName(cat.name)}</h3>
        </div>
        <div class="cat-pct">${Math.round(pct)}%</div>
      </div>
      <div class="cat-meta"><span>${cat.subtitle}</span><span>${done}/${total} 已完成</span></div>
      <div class="cat-status-row">
        <div class="cat-reading">${readingNow > 0 ? `${readingNow} 本進行中` : '當前沒有在讀'}</div>
        <div class="cat-reading">已啟動 ${started}/${total}</div>
      </div>
      <div class="cat-bar"><div class="cat-bar-fill" style="width:${pct}%;background:${cat.color}"></div></div>
      <div class="cat-foot">
        <span>分類完成率</span>
        <span>啟動後平均進度 ${Math.round(momentum)}%</span>
      </div>
      <div class="cat-mini-track"><div class="cat-mini-fill" style="width:${momentum}%"></div></div>
    </div>`;
  }).join('');

  // Trigger visual enhancements after rendering
  // Use RAF to ensure DOM is ready
  requestAnimationFrame(() => requestAnimationFrame(() => {
    applyVisualEnhancements();
  }));
}

/* ============================================
   Page Navigation
   ============================================ */

function openCategory(catId) {
  const cat = categories.find(c => c.id === catId);
  if (!cat) return;

  handlePageTransition('category-page');

  const page = document.getElementById('category-page');
  page.innerHTML = `
    <nav class="back-bar" aria-label="分類導航">
      <button class="back-btn" onclick="backToDashboard()" type="button">返回</button>
      <span style="color:var(--text);display:flex;align-items:center;gap:10px">
        ${getCategoryIcon(cat.id)}
        <span>${cleanDisplayName(cat.name)} <span style="color:var(--muted)">${cat.subtitle}</span></span>
      </span>
    </nav>
    <h2 class="sr-only">${cleanDisplayName(cat.name)} - 書單列表</h2>
    <div class="books-list" role="list">
      ${cat.books.map(book => buildBookItem(book, cat.color)).join('')}
    </div>
  `;

  cat.books.forEach(book => {
    const img = document.getElementById('cover-' + book.id);
    if (img && book.cover_url) {
      img.onload = () => {
        img.style.display = 'block';
        const placeholder = img.nextElementSibling;
        if (placeholder) placeholder.style.display = 'none';
      };
      img.onerror = () => {
        img.style.display = 'none';
        const placeholder = img.nextElementSibling;
        if (placeholder) {
          placeholder.style.display = 'flex';
          placeholder.style.background = getPlaceholderColor(book.title);
        }
      };
    }
  });
}

function backToDashboard() {
  handlePageTransition('dashboard');
  buildDashboard();
}

/* ============================================
   Reading Actions
   ============================================ */

function startReading(bookId, event) {
  event.stopPropagation();
  const today = todayStr();
  readingLogs[bookId] = {
    startDate: today,
    endDate: null,
    previousState: getCurrentBookState(bookId)
  };
  saveReadingLogs();

  const current = ensureBookState(bookId);
  current.status = 'reading';
  if (current.progress === 0) current.progress = 1;
  saveState();

  rerenderBookItem(bookId);
  buildDashboard();
  saveToURL();
}

function markDone(bookId, event) {
  event.stopPropagation();
  const today = todayStr();
  if (readingLogs[bookId]) {
    readingLogs[bookId].endDate = today;
    saveReadingLogs();
  }
  const current = ensureBookState(bookId);
  current.status = 'done';
  current.progress = 100;
  saveState();

  rerenderBookItem(bookId);
  buildDashboard();
  saveToURL();
}

function undoReading(bookId, event) {
  event.stopPropagation();
  const log = readingLogs[bookId];
  if (!log) return;

  const fallback = { status: 'unread', progress: 0 };
  state[bookId] = log.previousState
    ? { ...fallback, ...log.previousState }
    : fallback;

  delete readingLogs[bookId];
  saveReadingLogs();
  saveState();

  rerenderBookItem(bookId);
  buildDashboard();
  saveToURL();
}

function updateStatus(id, status) {
  const previousState = getCurrentBookState(id);
  const current = ensureBookState(id);
  current.status = status;

  if (status === 'unread') {
    current.progress = 0;
    delete readingLogs[id];
    saveReadingLogs();
  } else if (status === 'reading') {
    if (!readingLogs[id]) {
      readingLogs[id] = { startDate: todayStr(), endDate: null, previousState };
      saveReadingLogs();
    } else if (readingLogs[id].endDate) {
      readingLogs[id].endDate = null;
      saveReadingLogs();
    }
    if (current.progress === 0) current.progress = 1;
  } else if (status === 'done') {
    current.progress = 100;
    if (!readingLogs[id]) {
      readingLogs[id] = { startDate: todayStr(), endDate: todayStr(), previousState };
    } else {
      readingLogs[id].endDate = todayStr();
    }
    saveReadingLogs();
  }

  saveState();
  rerenderBookItem(id);
  buildDashboard();
  saveToURL();
}

function updateProgress(id, val) {
  const v = parseInt(val);
  const previousState = getCurrentBookState(id);
  const current = ensureBookState(id);
  current.progress = v;

  const pctEl = document.getElementById('pct-' + id);
  if (pctEl) pctEl.textContent = v + '%';

  const slider = document.getElementById('slider-' + id);
  if (slider) slider.setAttribute('aria-valuenow', v);

  if (v === 100) {
    current.status = 'done';
    if (!readingLogs[id]) {
      readingLogs[id] = { startDate: todayStr(), endDate: todayStr(), previousState };
    } else {
      readingLogs[id].endDate = todayStr();
    }
    saveReadingLogs();
  } else if (v === 0) {
    current.status = 'unread';
    if (readingLogs[id]) {
      delete readingLogs[id];
      saveReadingLogs();
    }
  } else {
    current.status = 'reading';
    if (!readingLogs[id]) {
      readingLogs[id] = { startDate: todayStr(), endDate: null, previousState };
    } else {
      readingLogs[id].endDate = null;
    }
    saveReadingLogs();
  }

  saveState();
  rerenderBookItem(id);
  buildDashboard();
  saveToURL();
}

/* ============================================
   Reading Calendar
   ============================================ */

function openCalendar() {
  handlePageTransition('calendar-page');
  renderCalendar(calYear);
}

function renderCalendar(year) {
  const page = document.getElementById('calendar-page');
  page.innerHTML = `
    <div class="cal-header-bar">
      <div>
        <nav class="back-bar" style="margin-bottom:0" aria-label="日曆導航">
          <button class="back-btn" onclick="backToDashboard()" type="button">返回</button>
          <span style="color:var(--text)">閱讀日曆</span>
        </nav>
        <div class="cal-header-copy">用一年視角查看閱讀軌跡。</div>
      </div>
      <div class="cal-nav" aria-label="年份切換">
        <button class="cal-nav-btn" onclick="changeCalYear(-1)" type="button" aria-label="上一年">‹</button>
        <span class="cal-year-display" role="heading" aria-level="2">${year} 年</span>
        <button class="cal-nav-btn" onclick="changeCalYear(1)" type="button" aria-label="下一年">›</button>
      </div>
    </div>
    <div class="cal-grid" id="cal-grid" role="grid" aria-label="月度閱讀日曆"></div>
  `;
  buildCalendarGrid(year);
}

function changeCalYear(dir) {
  calYear += dir;
  renderCalendar(calYear);
}

function buildCalendarGrid(year) {
  const grid = document.getElementById('cal-grid');
  const today = todayStr();
  let html = '';

  for (let month = 0; month < 12; month++) {
    html += `<div class="cal-month" role="gridcell" aria-label="${year}年${MONTHS_CN[month]}">
      <div class="cal-month-label">${MONTHS_CN[month]}</div>
      <div class="cal-month-grid" id="cal-m-${month}" role="rowgroup"></div>
    </div>`;
  }
  grid.innerHTML = html;

  for (let month = 0; month < 12; month++) {
    renderMonthGrid(year, month, today);
  }
}

function renderMonthGrid(year, month, today) {
  const container = document.getElementById(`cal-m-${month}`);
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay();
  const totalDays = lastDay.getDate();

  let html = '';
  // Day headers
  ['日', '一', '二', '三', '四', '五', '六'].forEach(d => {
    html += `<div style="font-size:0.5rem;color:var(--muted);text-align:center;margin-bottom:2px" aria-hidden="true">${d}</div>`;
  });

  // Pad start
  for (let i = 0; i < startDow; i++) {
    html += `<div class="cal-day other-month" aria-hidden="true"></div>`;
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = dateStr === today;
    const reading = dateStr <= today ? getReadingForDate(dateStr) : null;

    let classes = 'cal-day';
    if (isToday) classes += ' today-cell';
    if (reading) classes += ' reading-fill';

    const readingLabel = reading
      ? `<span class="cal-reading-label">${getBookShortName(reading.title)}</span>`
      : '';

    const dayLabel = reading
      ? `${day}日 - 閱讀: ${reading.title}`
      : `${day}日`;

    html += `<div class="${classes}" data-date="${dateStr}"
      data-reading='${reading ? JSON.stringify(reading).replace(/'/g, '&#39;') : ''}'
      onmouseenter="showCalTip(event,this)" onmouseleave="hideCalTip()"
      role="gridcell" aria-label="${dayLabel}">
      <span class="cal-day-num">${day}</span>${readingLabel}
    </div>`;
  }

  container.innerHTML = html;
}

function getBookShortName(title) {
  if (title.length <= 4) return title;
  return title.substring(0, 3) + '…';
}

function getReadingForDate(dateStr) {
  const today = todayStr();
  if (dateStr > today) return null;

  for (const [bookId, log] of Object.entries(readingLogs)) {
    if (!log || !log.startDate) continue;
    let active = false;
    if (log.startDate <= dateStr) {
      if (!log.endDate) {
        active = dateStr <= today;
      } else {
        active = log.endDate >= dateStr;
      }
    }
    if (active) {
      const book = getBookById(bookId);
      if (book) {
        const catColor = getCatColor(bookId);
        const cover = book.cover_url || null;
        return { bookId, title: book.title, cover_url: cover, color: catColor };
      }
    }
  }
  return null;
}

function showCalTip(event, el) {
  const dateStr = el.dataset.date;
  const readingData = el.dataset.reading;
  if (!readingData) { hideCalTip(); return; }

  try {
    const reading = JSON.parse(readingData.replace(/&#39;/g, "'"));
    const tip = document.getElementById('cal-tooltip');
    const titleEl = document.getElementById('cal-tip-title');
    const metaEl = document.getElementById('cal-tip-meta');

    const log = readingLogs[reading.bookId];
    let days = 0;
    if (log) {
      const start = new Date(log.startDate);
      const hoverDate = new Date(`${dateStr}T00:00:00`);
      const end = log.endDate ? new Date(log.endDate) : new Date();
      const effectiveEnd = hoverDate < end ? hoverDate : end;
      days = Math.max(1, Math.round((effectiveEnd - start) / 86400000) + 1);
    }

    titleEl.textContent = reading.title;
    metaEl.textContent = `${dateStr} · 已讀 ${days} 天`;

    const cover = document.getElementById('cal-tip-cover');
    if (reading.cover_url) {
      cover.src = reading.cover_url;
      cover.style.display = 'block';
      cover.onerror = function () {
        this.style.display = 'none';
        const fb = document.getElementById('cal-tip-fallback');
        if (fb) fb.style.display = 'flex';
      };
      const fb = document.getElementById('cal-tip-fallback');
      if (fb) fb.style.display = 'none';
    } else {
      cover.style.display = 'none';
    }

    tip.setAttribute('aria-hidden', 'false');
    const rect = el.getBoundingClientRect();
    tip.style.left = Math.min(rect.left, window.innerWidth - 180) + 'px';
    tip.style.top = (rect.top - 60) + 'px';
  } catch (e) {
    // Silent fail for tooltip
  }
}

function hideCalTip() {
  const tip = document.getElementById('cal-tooltip');
  if (tip) tip.setAttribute('aria-hidden', 'true');
}

/* ============================================
   Service Worker Registration
   ============================================ */

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.warn('SW registration failed:', err));
  }
}

/* ============================================
   Initialization
   ============================================ */

function init() {
  loadFromURL();
  loadState();
  loadReadingLogs();
  buildDashboard();
  registerServiceWorker();
}

document.addEventListener('DOMContentLoaded', init);
