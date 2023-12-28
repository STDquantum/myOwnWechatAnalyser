const itemsPerPage = 1000; // 每页显示的元素个数
let currentPage = 1; // 当前页
// var reachedBottom = false; // 到达底部的标记
// var lastScrollTop = 0;

function renderPage(page) {
    const snsContainer = document.getElementsByClassName('items')[0];

    // 计算当前页应该显示的元素范围
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    snsContainer.innerHTML = "";

    function replaceEmoji(text) {
        // 定义替换规则，可以根据需要添加更多规则
        var replacementRules = [
            { pattern: /\[微笑\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_1@2x.png" id="微笑" class="emoji_img">' },
            { pattern: /\[发呆\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_4@2x.png" id="发呆" class="emoji_img">' },
            { pattern: /\[撇嘴\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_2@2x.png" id="撇嘴" class="emoji_img">' },
            { pattern: /\[色\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_3@2x.png" id="色" class="emoji_img">' },
            { pattern: /\[发呆\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_4@2x.png" id="发呆" class="emoji_img">' },
            { pattern: /\[得意\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_5@2x.png" id="得意" class="emoji_img">' },
            { pattern: /\[流泪\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_6@2x.png" id="流泪" class="emoji_img">' },
            { pattern: /\[害羞\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_7@2x.png" id="害羞" class="emoji_img">' },
            { pattern: /\[闭嘴\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_8@2x.png" id="闭嘴" class="emoji_img">' },
            { pattern: /\[睡\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_9@2x.png" id="睡" class="emoji_img">' },
            { pattern: /\[大哭\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_10@2x.png" id="大哭" class="emoji_img">' },
            { pattern: /\[尴尬\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_11@2x.png" id="尴尬" class="emoji_img">' },
            { pattern: /\[发怒\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_12@2x.png" id="发怒" class="emoji_img">' },
            { pattern: /\[调皮\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_13@2x.png" id="调皮" class="emoji_img">' },
            { pattern: /\[呲牙\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_14@2x.png" id="呲牙" class="emoji_img">' },
            { pattern: /\[惊讶\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_15@2x.png" id="惊讶" class="emoji_img">' },
            { pattern: /\[难过\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_16@2x.png" id="难过" class="emoji_img">' },
            { pattern: /\[抓狂\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_19@2x.png" id="抓狂" class="emoji_img">' },
            { pattern: /\[吐\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_20@2x.png" id="吐" class="emoji_img">' },
            { pattern: /\[偷笑\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_21@2x.png" id="偷笑" class="emoji_img">' },
            { pattern: /\[愉快\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_22@2x.png" id="愉快" class="emoji_img">' },
            { pattern: /\[白眼\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_23@2x.png" id="白 眼" class="emoji_img">' },
            { pattern: /\[傲慢\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_24@2x.png" id="傲慢" class="emoji_img">' },
            { pattern: /\[困\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_26@2x.png" id="困" class="emoji_img">' },
            { pattern: /\[惊恐\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_27@2x.png" id="惊恐" class="emoji_img">' },
            { pattern: /\[憨笑\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_29@2x.png" id="憨笑" class="emoji_img">' },
            { pattern: /\[悠闲\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_30@2x.png" id="悠闲" class="emoji_img">' },
            { pattern: /\[咒骂\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_32@2x.png" id="咒骂" class="emoji_img">' },
            { pattern: /\[疑问\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_33@2x.png" id="疑问" class="emoji_img">' },
            { pattern: /\[嘘\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_34@2x.png" id="嘘" class="emoji_img">' },
            { pattern: /\[晕\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_35@2x.png" id="晕" class="emoji_img">' },
            { pattern: /\[衰\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_37@2x.png" id="衰" class="emoji_img">' },
            { pattern: /\[骷髅\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_38@2x.png" id="骷髅" class="emoji_img">' },
            { pattern: /\[敲打\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_39@2x.png" id="敲打" class="emoji_img">' },
            { pattern: /\[再见\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_40@2x.png" id="再见" class="emoji_img">' },
            { pattern: /\[擦汗\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_41@2x.png" id="擦汗" class="emoji_img">' },
            { pattern: /\[抠鼻\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_42@2x.png" id="抠鼻" class="emoji_img">' },
            { pattern: /\[鼓掌\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_43@2x.png" id="鼓掌" class="emoji_img">' },
            { pattern: /\[坏笑\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_45@2x.png" id="坏笑" class="emoji_img">' },
            { pattern: /\[右哼哼\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_47@2x.png" id="右哼哼" class="emoji_img">' },
            { pattern: /\[鄙视\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_49@2x.png" id="鄙视" class="emoji_img">' },
            { pattern: /\[委屈\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_50@2x.png" id="委屈" class="emoji_img">' },
            { pattern: /\[快哭了\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_51@2x.png" id="快哭了" class="emoji_img">' },
            { pattern: /\[阴险\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_52@2x.png" id="阴险" class="emoji_img">' },
            { pattern: /\[亲亲\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_53@2x.png" id="亲亲" class="emoji_img">' },
            { pattern: /\[可怜\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_55@2x.png" id="可怜" class="emoji_img">' },
            { pattern: /\[可憐\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_55@2x.png" id="可怜" class="emoji_img">' },
            { pattern: /\[Whimper\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_55@2x.png" id="可怜" class="emoji_img">' },
            { pattern: /\[笑脸\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Happy.png" id="笑脸" class="emoji_img">' },
            { pattern: /\[生病\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Sick.png" id="生病" class="emoji_img">' },
            { pattern: /\[脸红\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Flushed.png" id="脸红" class="emoji_img">' },
            { pattern: /\[破涕为笑\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Lol.png" id="破涕为笑" class="emoji_img">' },
            { pattern: /\[恐惧\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Terror.png" id="恐惧" class="emoji_img">' },
            { pattern: /\[失望\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/LetDown.png" id="失望" class="emoji_img">' },
            { pattern: /\[无语\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Duh.png" id="无语" class="emoji_img">' },
            { pattern: /\[嘿哈\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/2_04.png" id="嘿哈" class="emoji_img">' },
            { pattern: /\[捂脸\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/2_05.png" id="捂脸" class="emoji_img">' },
            { pattern: /\[奸笑\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/2_02.png" id="奸笑" class="emoji_img">' },
            { pattern: /\[机智\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/2_06.png" id="机智" class="emoji_img">' },
            { pattern: /\[皱眉\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/2_12.png" id="皱眉" class="emoji_img">' },
            { pattern: /\[耶\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/2_11.png" id="耶" class="emoji_img">' },
            { pattern: /\[吃瓜\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Watermelon.png" id="吃瓜" class="emoji_img">' },
            { pattern: /\[加油\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Addoil.png" id="加油" class="emoji_img">' },
            { pattern: /\[汗\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Sweat.png" id="汗" class="emoji_img">' },
            { pattern: /\[天啊\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Shocked.png" id="天啊" class="emoji_img">' },
            { pattern: /\[Emm\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Cold.png" id="Emm" class="emoji_img">' },
            { pattern: /\[社会社会\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Social.png" id="社会社会" class="emoji_img">' },
            { pattern: /\[旺柴\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Yellowdog.png" id="旺柴" class="emoji_img">' },
            { pattern: /\[好的\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/NoProb.png" id="好的" class="emoji_img">' },
            { pattern: /\[打脸\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Slap.png" id="打脸" class="emoji_img">' },
            { pattern: /\[哇\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Wow.png" id="哇" class="emoji_img">' },
            { pattern: /\[翻白眼\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Boring.png" id="翻白眼" class="emoji_img">' },
            { pattern: /\[666\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/666.png" id="666" class="emoji_img">' },
            { pattern: /\[让我看看\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/LetMeSee.png" id="让我看看" class="emoji_img">' },
            { pattern: /\[叹气\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Sigh.png" id="叹气" class="emoji_img">' },
            { pattern: /\[苦涩\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Hurt.png" id="苦涩" class="emoji_img">' },
            { pattern: /\[裂开\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Broken.png" id="裂开" class="emoji_img">' },
            { pattern: /\[嘴唇\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_66@2x.png" id="嘴唇" class="emoji_img">' },
            { pattern: /\[爱心\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_67@2x.png" id="爱心" class="emoji_img">' },
            { pattern: /\[心碎\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_68@2x.png" id="心碎" class="emoji_img">' },
            { pattern: /\[拥抱\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_79@2x.png" id="拥抱" class="emoji_img">' },
            { pattern: /\[擁抱\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_79@2x.png" id="拥抱" class="emoji_img">' },
            { pattern: /\[强\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_80@2x.png" id="强" class="emoji_img">' },
            { pattern: /\[弱\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_81@2x.png" id="弱" class="emoji_img">' },
            { pattern: /\[握手\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_82@2x.png" id="握手" class="emoji_img">' },
            { pattern: /\[胜利\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_83@2x.png" id="胜利" class="emoji_img">' },
            { pattern: /\[抱拳\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_84@2x.png" id="抱拳" class="emoji_img">' },
            { pattern: /\[勾引\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_85@2x.png" id="勾引" class="emoji_img">' },
            { pattern: /\[拳头\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_86@2x.png" id="拳头" class="emoji_img">' },
            { pattern: /\[OK\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_90@2x.png" id="OK" class="emoji_img">' },
            { pattern: /\[合十\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Worship.png" id="合十" class="emoji_img">' },
            { pattern: /\[啤酒\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_58@2x.png" id="啤酒" class="emoji_img">' },
            { pattern: /\[咖啡]\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_61@2x.png" id="咖啡" class="emoji_img">' },
            { pattern: /\[蛋糕\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_69@2x.png" id="蛋糕" class="emoji_img">' },
            { pattern: /\[玫瑰\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_64@2x.png" id="玫 瑰" class="emoji_img">' },
            { pattern: /\[凋谢\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_65@2x.png" id="凋谢" class="emoji_img">' },
            { pattern: /\[菜刀\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_56@2x.png" id="菜刀" class="emoji_img">' },
            { pattern: /\[炸弹\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_71@2x.png" id="炸弹" class="emoji_img">' },
            { pattern: /\[便便\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_75@2x.png" id="便便" class="emoji_img">' },
            { pattern: /\[月亮\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_76@2x.png" id="月亮" class="emoji_img">' },
            { pattern: /\[太阳\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_77@2x.png" id="太阳" class="emoji_img">' },
            { pattern: /\[庆祝\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Party.png" id="庆祝" class="emoji_img">' },
            { pattern: /\[礼物\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_78@2x.png" id="礼物" class="emoji_img">' },
            { pattern: /\[红包\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/2_09.png" id="红包" class="emoji_img">' },
            { pattern: /\[發\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/2_16.png" id="發" class="emoji_img">' },
            { pattern: /\[福\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/2_15.png" id="福" class="emoji_img">' },
            { pattern: /\[烟花\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Fireworks.png" id="烟花" class="emoji_img">' },
            { pattern: /\[爆竹\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/newemoji/Firecracker.png" id="爆竹" class="emoji_img">' },
            { pattern: /\[猪头\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_63@2x.png" id="猪头" class="emoji_img">' },
            { pattern: /\[跳跳\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_93@2x.png" id="跳跳" class="emoji_img">' },
            { pattern: /\[发抖\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_94@2x.png" id="发抖" class="emoji_img">' },
            { pattern: /\[转圈\]/g, replacement: '<img src="https://res.wx.qq.com/t/wx_fed/we-emoji/res/v1.2.8/assets/Expression/Expression_96@2x.png" id="转圈" class="emoji_img">' },
            { pattern: /🥹/g, replacement: '<img src="https://em-content.zobj.net/source/apple/354/face-holding-back-tears_1f979.png" id="Face Holding Back Tears" class="emoji_img">' },
            { pattern: /🥲/g, replacement: '<img src="https://em-content.zobj.net/source/apple/354/smiling-face-with-tear_1f972.png" id="Smiling Face with Tear" class="emoji_img">' },
            { pattern: //g, replacement: '<img src="https://em-content.zobj.net/source/apple/354/thumbs-up_1f44d.png" id="拇指向上" class="emoji_img">' },
            { pattern: /🇫🇷/g, replacement: '<img src="https://em-content.zobj.net/source/apple/354/flag-france_1f1eb-1f1f7.png" id="法国国旗" class="emoji_img">' },
            { pattern: /🫠/g, replacement: '<img src="https://em-content.zobj.net/source/apple/354/melting-face_1fae0.png" id="Melting Face" class="emoji_img">' },
        ];

        // 循环遍历替换规则
        for (var i = 0; i < replacementRules.length; i++) {
            var rule = replacementRules[i];
            text = text.replace(rule.pattern, rule.replacement);
        }
        return text;
    }

    function timestampToTime(timestamp) {
        let date = new Date(timestamp * 1000);
        let year = date.getFullYear() + '-';
        let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        let hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return year + month + day + hour + minute + second;
    }
    // 生成各类标签的函数
    function avatarBox(sns) {
        const avatarTag = document.createElement('div');
        avatarTag.className = "avatar-box";
        avatarTag.innerHTML = `<img src="./avatar/${sns.sender_id}" />`
        return avatarTag;
    }
    function senderName(sns) {
        const sender_name = document.createElement('div');
        sender_name.className = "sender_name";
        sender_name.innerHTML = sns.sender_remark;
        return sender_name;
    }
    function snsContent(sns) {
        const sns_content = document.createElement('div');
        sns_content.className = `sns-content`;
        sns_content.innerHTML = replaceEmoji(sns.content);
        return sns_content;
    }
    function snsImgs(sns) {
        if (sns.custom_image_path.length == 1) {
            return snsImgsOnePic(sns);
        } else {
            return snsImgsMoreThanOnePics(sns);
        }
    }
    function snsImgsOnePic(sns) {
        const sns_imgs_one_pic = document.createElement('div');
        sns_imgs_one_pic.className = `sns-imgs one-pic`;
        const img_container_one_pic = document.createElement('div');
        img_container_one_pic.className = 'img-container one-pic'
        img_container_one_pic.innerHTML = `<img src="${sns.custom_image_path[0]}"  onclick="showModal(this)" />`
        sns_imgs_one_pic.appendChild(img_container_one_pic);
        return sns_imgs_one_pic;
    }
    function snsImgsMoreThanOnePics(sns) {
        const sns_imgs_more_than_one_pics = document.createElement('div');
        sns_imgs_more_than_one_pics.className = `sns-imgs more-than-one-pics`;
        for (const img_path of sns.custom_image_path) {
            const img_container_one_pic = document.createElement('div');
            img_container_one_pic.className = 'img-container more-than-one-pics'
            img_container_one_pic.innerHTML = `<img src="${img_path}" onclick="showModal(this)" />`
            sns_imgs_more_than_one_pics.appendChild(img_container_one_pic);
        }
        return sns_imgs_more_than_one_pics;
    }
    function snsLocation(sns) {
        const location = document.createElement('div');
        if (sns.location.location_address != "") {
            location.className = "location";
            const longitude = sns.location.location_longitude;
            const latitude = sns.location.location_latitude;
            const address = sns.location.location_address;
            const addressURI = encodeURI(address);
            location.innerHTML = `<a target="_blank" href="http://api.map.baidu.com/marker?location=${latitude},${longitude}&title=我的位置&content=${addressURI}&output=html&coord_type=wgs84&src=baidu.com">${address}</a>`;
        }
        return location;
    }
    function snsTime(sns) {
        const time = document.createElement('div');
        time.className = `time`;
        time.innerHTML = timestampToTime(sns.timestamp);
        return time;
    }
    function likesBox(sns) {
        const likes_box = document.createElement('div');
        likes_box.className = 'likes-box';
        const like_icon = document.createElement('div');
        like_icon.className = "like-icon";
        like_icon.innerHTML = "❤";
        likes_box.appendChild(like_icon);
        likes_box.appendChild(likeGrid(sns));
        return likes_box;
    }
    function likeGrid(sns) {
        const like_grid = document.createElement('div');
        like_grid.className = 'like-grid';
        for (const sns_like of sns.likes) {
            const like_container = document.createElement('div');
            like_container.className = 'like-container';

            const like = document.createElement('div');
            like.className = 'like';
            like.innerHTML = `<img src="./avatar/${sns_like.sender_id}" />`
            like.onmouseover = showTooltip;
            like.onmouseout = hideTooltip;

            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = sns_like.sender_remark;

            like_container.appendChild(like);
            like_container.appendChild(tooltip);

            like_grid.appendChild(like_container)
        }
        return like_grid;
    }
    function commentsBox(sns) {
        const comments_box = document.createElement('div');
        comments_box.className = `comments-box`;

        const comment_icon = document.createElement('div');
        comment_icon.className = 'comment-icon';
        comment_icon.innerHTML = "✉";

        const comment_grid = document.createElement('div');
        comment_grid.className = 'comment-grid';
        for (const comment of sns.comments) {
            const comment_container = document.createElement('div');
            comment_container.className = "comment-container";

            // begin .user-info
            const user_info = document.createElement('div');
            user_info.className = "user-info";

            const avatar = document.createElement('img');
            avatar.className = 'avatar';
            avatar.src = `./avatar/${comment.sender_id}`;

            // begin .user-info > .user-details
            const user_details = document.createElement('div');
            user_details.className = "user-details";

            const nickname = document.createElement('div');
            nickname.className = "nickname";
            nickname.innerText = comment.sender_remark;

            const comment_time = document.createElement('div');
            comment_time.className = "comment-time";
            comment_time.innerText = timestampToTime(comment.timestamp);

            user_details.appendChild(nickname);
            user_details.appendChild(comment_time);
            // end .user-info > .user-details

            user_info.appendChild(avatar);
            user_info.appendChild(user_details);
            // end .user-info

            // begin .comment-text
            const comment_text = document.createElement('div');
            comment_text.className = "comment-text";
            if (comment.ref_user_name != "") {
                comment_text.innerHTML = `回复&nbsp;<div class="comment-refer-text">${comment.ref_user_name}</div>:&nbsp;${replaceEmoji(comment.content)}`;
            } else {
                comment_text.innerHTML = replaceEmoji(comment.content);
            }
            // end .comment-text

            comment_container.appendChild(user_info);
            comment_container.appendChild(comment_text);
            comment_grid.appendChild(comment_container);
        }

        comments_box.appendChild(comment_icon);
        comments_box.appendChild(comment_grid);
        return comments_box;
    }

    // 从数据列表中取出对应范围的元素并添加到容器中
    for (let i = startIndex; i < endIndex && i < snsMessages.length; i++) {
        const sns = snsMessages[i];
        const snsItem = document.createElement('div'); // 下面那俩的合体
        const snsAvatarBox = avatarBox(sns); // 头像
        const snsItemBox = document.createElement('div'); // 除了avatar之外的所有
        snsItemBox.className = "sns-item-box";
        if (sns.type == 1) {
            snsItemBox.appendChild(senderName(sns));
            snsItemBox.appendChild(snsContent(sns));
            snsItemBox.appendChild(snsImgs(sns));
            snsItemBox.appendChild(snsLocation(sns));
            snsItemBox.appendChild(snsTime(sns));
            if (sns.likes.length != 0) {
                snsItemBox.appendChild(likesBox(sns));
            }
            if (sns.comments.length != 0) {
                snsItemBox.appendChild(commentsBox(sns));
            }
        } else if (sns.type == 2) {
            snsItemBox.appendChild(senderName(sns));
            snsItemBox.appendChild(snsContent(sns));
            snsItemBox.appendChild(snsLocation(sns));
            snsItemBox.appendChild(snsTime(sns));
            if (sns.likes.length != 0) {
                snsItemBox.appendChild(likesBox(sns));
            }
            if (sns.comments.length != 0) {
                snsItemBox.appendChild(commentsBox(sns));
            }
        }
        snsItem.className = "item";
        snsItem.appendChild(snsAvatarBox);
        snsItem.appendChild(snsItemBox);
        snsContainer.appendChild(snsItem);
    }
    // document.getElementsByTagName("body")[0].scrollTop = lastScrollTop;
    // updatePaginationInfo();
    refreshMediaListener();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
}

function nextPage() {
    const totalPages = Math.ceil(snsMessages.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
    }
}
function updatePaginationInfo() {
    return;
    const totalPages = Math.ceil(snsMessages.length / itemsPerPage);
    const paginationInfo = document.getElementById('paginationInfo');
    paginationInfo.textContent = `共 ${totalPages} 页，当前第 ${currentPage} 页`;
}
function gotoPage() {
    return;
    const totalPages = Math.ceil(snsMessages.length / itemsPerPage);
    const inputElement = document.getElementById('gotoPageInput');
    const targetPage = parseInt(inputElement.value);

    if (targetPage >= 1 && targetPage <= totalPages) {
        currentPage = targetPage;
        renderPage(currentPage);
    } else {
        alert('请输入有效的页码');
    }
}


function checkScroll() {
    return;
    var snsContainer = document.getElementsByTagName("body")[0];

    // 检查滚动条是否滑到底部
    if (snsContainer.scrollHeight - snsContainer.scrollTop - 10 <= snsContainer.clientHeight) {
        // 如果滚动条在底部
        if (!reachedBottom) {
            // 设置标记并返回
            reachedBottom = true;
            lastScrollTop = snsContainer.scrollTop;
        }
        if (reachedBottom) {
            nextPage();
        }
    }
}
// 初始化页面
renderPage(currentPage);

function refreshMediaListener() {
    const audioTags = document.querySelectorAll('audio');
    const videoTags = document.querySelectorAll('video');

    audioTags.forEach(audio => {
        audio.addEventListener('play', function () {
            pauseOtherMedia(audio);
        });
    });
    videoTags.forEach(video => {
        video.addEventListener('play', function () {
            pauseOtherMedia(video);
        });
    });

    function pauseOtherMedia(currentMedia) {
        const audioTags = document.querySelectorAll('audio');
        const videoTags = document.querySelectorAll('video');
        audioTags.forEach(media => {
            if (media !== currentMedia && !media.paused) {
                media.pause();
            }
        });
        videoTags.forEach(media => {
            if (media !== currentMedia && !media.paused) {
                media.pause();
            }
        });
    }
}

refreshMediaListener();

