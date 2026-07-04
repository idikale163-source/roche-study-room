window.RochePlugin.register({
  id: "roche-companion-study-room",
  name: "同频自习室",
  version: "1.4.0",
  apps: [
    {
      id: "roche-study-room-app",
      name: "同频自习室",
      icon: "local_library",
      async mount(container, roche) {
        const styleId = "roche-plugin-study-style";
        if (!document.getElementById(styleId)) {
          const style = document.createElement("style");
          style.id = styleId;
          style.textContent = `
            .sr-wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background-color: #FDFBF7; color: #4A4A4A; height: 100%; width: 100%; display: flex; flex-direction: column; padding: 16px; box-sizing: border-box; position: relative; overflow: hidden; }
            .sr-wrap * { box-sizing: border-box; }
            .sr-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-shrink: 0; }
            .sr-title { margin: 0; font-size: 20px; font-weight: bold; color: #6D8B74; display: flex; align-items: center; gap: 8px; }
            .sr-select { padding: 6px 12px; border-radius: 12px; border: 1px solid #D5E2D8; background: #FFF; outline: none; font-size: 14px; color: #4A4A4A; cursor: pointer; }
            .sr-close-btn { background: #FF6B6B; color: white; border: none; padding: 6px 12px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 14px; }
            
            .sr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1; align-content: start; }
            .sr-card { background: #FFF; border-radius: 16px; padding: 16px; box-shadow: 0 4px 12px rgba(109, 139, 116, 0.05); border: 1px solid #EAEFEA; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
            .sr-card:active { transform: scale(0.98); }
            .sr-card.span-2 { grid-column: span 2; }
            .sr-card.green { background: linear-gradient(135deg, #E8F3E9, #D2E4D5); border: none; }
            .sr-card.orange { background: linear-gradient(135deg, #FFF3E6, #FDE2CC); border: none; }
            
            .sr-val { font-size: 26px; font-weight: 800; color: #333; margin: 8px 0; }
            .sr-label { font-size: 12px; color: #777; }
            .sr-icon { font-size: 32px; margin-bottom: 4px; }
            .sr-page { display: none; position: absolute; top:0; left:0; width:100%; height:100%; background: #FDFBF7; flex-direction: column; padding: 16px; z-index: 10; }
            .sr-page.active { display: flex; }
            .sr-back-btn { align-self: flex-start; background: #EAEFEA; color: #6D8B74; border: none; padding: 8px 16px; border-radius: 20px; font-weight: bold; cursor: pointer; margin-bottom: 12px; display: flex; align-items: center; gap: 4px; }
            
            .sr-timer { font-size: 72px; font-weight: 900; color: #E07A5F; text-align: center; margin: 40px 0; font-variant-numeric: tabular-nums; text-shadow: 2px 2px 0px rgba(224, 122, 95, 0.1); }
            .sr-pomo-btn { background: #E07A5F; color: #FFF; border: none; padding: 16px; border-radius: 24px; font-size: 18px; font-weight: bold; width: 100%; margin-top: auto; cursor: pointer; box-shadow: 0 4px 12px rgba(224, 122, 95, 0.2); }
            .sr-pomo-msg { text-align: center; color: #555; font-size: 15px; font-style: italic; background: #FFF; padding: 16px; border-radius: 12px; border: 1px dashed #E07A5F; margin: 20px 0; min-height: 80px; display: flex; align-items: center; justify-content: center; }
            
            .sr-chat-box { flex: 1; overflow-y: auto; background: #FDFBF7; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; box-shadow: inset 0 2px 8px rgba(0,0,0,0.02); }
            .msg-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: flex-end; }
            .msg-row.user { flex-direction: row-reverse; }
            .msg-row.system { justify-content: center; }
            .msg-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: #EAEFEA; border: 1px solid #FFF; }
            .sr-bubble { max-width: 75%; padding: 10px 14px; border-radius: 18px; font-size: 15px; line-height: 1.5; word-break: break-word; }
            .sr-bubble.user { background: #6D8B74; color: #FFF; border-bottom-right-radius: 4px; }
            .sr-bubble.ai { background: #FFF; color: #333; border: 1px solid #EAEFEA; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
            .sr-bubble.system { background: transparent; color: #999; font-size: 12px; border: none; padding: 4px; }
            
            .sr-toolbar { display: flex; gap: 8px; margin-bottom: 8px; flex-shrink: 0; }
            .sr-file-btn, .sr-action-btn { flex: 1; padding: 10px; background: #F4F7F4; border: 1px solid #D5E2D8; border-radius: 12px; color: #6D8B74; font-weight: bold; cursor: pointer; text-align: center; font-size: 13px; position: relative; overflow: hidden; }
            .sr-file-btn input[type="file"] { position: absolute; top:0; left:0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
            .sr-input-area { display: flex; gap: 8px; flex-shrink: 0; }
            .sr-input-area input { flex: 1; padding: 12px; border: 1px solid #D5E2D8; border-radius: 20px; font-size: 14px; outline: none; }
            .sr-input-area button { padding: 0 20px; background: #6D8B74; color: #FFF; border: none; border-radius: 20px; font-weight: bold; cursor: pointer; }
            .sr-input-area button:disabled { background: #B0C4B4; }
            
            .chapter-list-item { background: #FFF; padding: 16px; border-radius: 12px; border: 1px solid #EAEFEA; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background 0.2s; }
            .chapter-list-item:active { background: #F4F7F4; }
            .chapter-title { font-size: 16px; font-weight: bold; color: #333; }
            .chapter-info { font-size: 12px; color: #777; margin-top: 4px; }
          `;
          document.head.appendChild(style);
        }
        
        container.innerHTML = `
          <div class="sr-wrap" id="sr-home">
            <div class="sr-header">
              <h1 class="sr-title">🌱 同频自习室</h1>
              <div style="display:flex; gap:8px;">
                <select class="sr-select" id="sr-char-select"><option value="">选择羁绊...</option></select>
                <button class="sr-close-btn" id="btn-close-app">关闭退出</button>
              </div>
            </div>
            <div class="sr-grid">
              <div class="sr-card span-2 green" id="card-time">
                <div class="sr-label" id="sr-date">----年--月--日</div>
                <div class="sr-val" id="sr-clock" style="font-size: 42px;">--:--</div>
                <div class="sr-label">陪伴，是最无声的告白</div>
              </div>
              <div class="sr-card">
                <div class="sr-icon" id="sr-lucky-icon">🎁</div>
                <div class="sr-val" id="sr-lucky-text" style="font-size: 16px;">--</div>
                <div class="sr-label">今日幸运物</div>
              </div>
              <div class="sr-card">
                <div class="sr-val" id="sr-lucky-num" style="color: #E07A5F;">--%</div>
                <div class="sr-label">专注指数</div>
              </div>
              <div class="sr-card span-2 orange" id="btn-pomo">
                <div class="sr-icon">🍅</div>
                <div class="sr-val" style="font-size: 18px;">深潜番茄钟</div>
                <div class="sr-label">25分钟纯净陪伴 / 结束自动写入记忆</div>
              </div>
              <div class="sr-card span-2" id="btn-class-entry" style="background: #FFF; border: 1px solid #D5E2D8;">
                <div class="sr-icon">📚</div>
                <div class="sr-val" style="font-size: 18px; color: #6D8B74;">专属讲堂</div>
                <div class="sr-label">导入资料，智能拆分，沉浸上课</div>
              </div>
            </div>
          </div>
          
          <!-- 番茄钟页面 -->
          <div class="sr-page" id="page-pomo">
            <button class="sr-back-btn" id="back-from-pomo">← 退回大厅</button>
            <div class="sr-timer" id="pomo-timer">25:00</div>
            <div class="sr-pomo-msg" id="pomo-msg">等待入座...</div>
            <button class="sr-pomo-btn" id="pomo-action">开始专注</button>
          </div>
          
          <!-- 层级 1：讲堂资料室 (历史记录 & 导入) -->
          <div class="sr-page" id="page-class-entry">
            <button class="sr-back-btn" id="back-from-class-entry">← 退回大厅</button>
            <h2 style="color:#6D8B74; margin-bottom: 8px;">讲堂资料室</h2>
            <div style="background:#FFF; padding: 16px; border-radius:12px; border:1px solid #EAEFEA; margin-bottom: 16px;">
                <div style="font-size:14px; color:#555; margin-bottom:12px;">导入学习资料（PDF/Docx/TXT），AI 将通读并分发章节。</div>
                <div class="sr-file-btn" style="width:100%;">
                  📎 导入新资料并解析
                  <input type="file" id="class-file-entry" accept=".txt,.md,.pdf,.docx,.json" />
                </div>
            </div>
            <h3 style="color:#6D8B74; font-size:16px;">历史讲堂记录</h3>
            <div id="class-history-list" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:8px;"></div>
          </div>
          
          <!-- 层级 2：章节选择页面 (解析完成后展示) -->
          <div class="sr-page" id="page-chapter-list">
            <button class="sr-back-btn" id="back-from-chapter-list">← 退回资料室</button>
            <h2 style="color:#6D8B74; margin-bottom: 8px;" id="chapter-list-title">课本目录</h2>
            <div style="font-size:12px; color:#777; margin-bottom:16px;">解析完成，请点击下方章节进入专属课堂</div>
            <div id="chapter-list-container" style="flex:1; overflow-y:auto;"></div>
          </div>
          
          <!-- 层级 3：实际上课聊天页面 -->
          <div class="sr-page" id="page-class">
            <button class="sr-back-btn" id="back-from-class">← 返回目录</button>
            <h3 style="margin:0 0 12px 0; color:#6D8B74; text-align:center; font-size:16px;" id="current-class-title">当前课堂</h3>
            <div class="sr-toolbar">
              <button class="sr-action-btn" id="class-export">📥 导出本节课笔记</button>

              <button class="sr-action-btn" id="view-doc-btn" style="margin-left: 8px;">📄 查看当前资料</button>

            </div>
            <div class="sr-chat-box" id="class-box"></div>
            <div class="sr-input-area">

            <!-- 原文弹窗 -->
            <div id="doc-modal" style="display:none; position:absolute; top:10%; left:5%; right:5%; bottom:10%; background:#fff; border-radius:12px; z-index:999; box-shadow:0 4px 20px rgba(0,0,0,0.3); flex-direction:column; overflow:hidden;">
                <div style="padding:12px; background:#6D8B74; color:#fff; display:flex; justify-content:space-between; align-items:center;">
                    <h4 style="margin:0;">📄 资料原文</h4>
                    <button id="close-doc-modal" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer;">✖</button>
                </div>
                <div id="doc-modal-content" style="flex:1; overflow-y:auto; padding:12px; font-size:14px; color:#333; white-space:pre-wrap; line-height:1.6;"></div>
            </div>

              <input type="text" id="class-input" placeholder="提问或讨论..." disabled>
              <button id="class-send" disabled>发送</button>
            </div>
          </div>
        `;

        const ui = {
          home: container.querySelector("#sr-home"),
          pagePomo: container.querySelector("#page-pomo"),
          pageClassEntry: container.querySelector("#page-class-entry"),
          pageChapterList: container.querySelector("#page-chapter-list"),
          pageClass: container.querySelector("#page-class"),
          charSelect: container.querySelector("#sr-char-select"),
          btnCloseApp: container.querySelector("#btn-close-app"),
          pomoTimer: container.querySelector("#pomo-timer"),
          pomoMsg: container.querySelector("#pomo-msg"),
          pomoAction: container.querySelector("#pomo-action"),
          classBox: container.querySelector("#class-box"),
          classInput: container.querySelector("#class-input"),
          classSend: container.querySelector("#class-send"),
          
          classExport: container.querySelector("#class-export"),
          viewDocBtn: container.querySelector("#view-doc-btn"),
          docModal: container.querySelector("#doc-modal"),
          closeDocModal: container.querySelector("#close-doc-modal"),
          docModalContent: container.querySelector("#doc-modal-content"),

          btnClassEntry: container.querySelector("#btn-class-entry"),
          backFromClassEntry: container.querySelector("#back-from-class-entry"),
          fileEntry: container.querySelector("#class-file-entry"),
          historyList: container.querySelector("#class-history-list"),
          chapterListContainer: container.querySelector("#chapter-list-container"),
          chapterListTitle: container.querySelector("#chapter-list-title"),
          backFromChapterList: container.querySelector("#back-from-chapter-list"),
          backFromClass: container.querySelector("#back-from-class"),
          currentClassTitle: container.querySelector("#current-class-title")
        };

        const session = {
          charId: null, charName: "", conversationId: null, userName: "我",
          pomoTimer: null, pomoTimeLeft: 25 * 60, isPomoRunning: false,
          classMessages: [], documentChunks: [], currentDocTitle: "", currentChunkIdx: -1, charAvatar: "", userAvatar: ""
        };
        
        // 数据库操作辅助
        const openDB = () => new Promise((resolve, reject) => {
            const req = indexedDB.open("roche_study_plugin_db", 2);
            req.onupgradeneeded = e => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains("lectures")) {
                    db.createObjectStore("lectures", { keyPath: "id", autoIncrement: true });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });

        ui.btnCloseApp.onclick = () => roche.ui.closeApp();
        
        const checkAuth = () => {
          if (!session.charId) { roche.ui.toast("请先在顶部选择羁绊对象"); return false; }
          return true;
        };

        ui.charSelect.addEventListener('change', async (e) => {
          session.charId = e.target.value;
          if (!session.charId) return;
          session.charName = e.target.options[e.target.selectedIndex].text;
          roche.ui.toast(`已绑定: ${session.charName}`);
          const charObj = await roche.character.get(session.charId); session.charAvatar = charObj.avatar || ''; const convs = await roche.conversation.list(session.charId);
          if (convs && convs.length > 0) session.conversationId = convs[0].id;
          else session.conversationId = null;
        });

        ui.home.querySelector("#btn-pomo").onclick = () => {
          if(checkAuth()) {
            ui.home.style.display = "none";
            ui.pagePomo.classList.add("active");
          }
        };
        ui.pagePomo.querySelector("#back-from-pomo").onclick = () => {
          ui.pagePomo.classList.remove("active");
          ui.home.style.display = "flex";
        };

        const generateMemoryArchivalPrompt = (logText) => {
          return `### [System Instruction: Memory Archival]
当前日期: ${new Date().toLocaleDateString()}
任务: 请回顾刚才在自习室里的互动记录，生成一份【高精度的事件日志】。
### 核心撰写规则 (Strict Protocols)
1.  **覆盖率 (Coverage)**: 必须包含聊过的**每一个**独立话题、看过的资料章节或完成的专注任务。
2.  **视角 (Perspective)**: 你【就是】"${session.charName}"。这是【你】的私密日记。必须用"我"来称呼自己，用"${session.userName}"称呼对方。
3.  **格式 (Format)**: **必须**使用 Markdown 无序列表 ( - ... )。
4.  **去水 (Conciseness)**: 直接写发生了什么。示例: "- ${session.userName}上传了资料第二章，我抽查了重点。"
### 待处理记录
${logText}`;
        };

        const buildContext = async () => {
          let userBio = "无"; let charBio = "无"; let coreMem = "无"; let factsMem = "无"; let shortTerm = "无"; let worldbook = "无";
          try {
            const activeUser = await roche.persona.getActiveUserPersona();
            userBio = activeUser?.persona || activeUser?.bio || "无";
            const char = await roche.character.get(session.charId);
            charBio = char.persona || char.bio || "无";
            if(session.conversationId) {
              const lt = await roche.memory.getLongTerm({ conversationId: session.conversationId, limit: 50 });
              coreMem = lt.core?.summary || "无";
              factsMem = (lt.facts || []).map(f => f.summaryText || f.action || "").filter(Boolean).join('; ') || "无";
              const st = await roche.memory.getShortTerm({ conversationId: session.conversationId, limit: 10 });
              shortTerm = st.map(m => `${m.senderName}: ${m.text}`).join('\n') || "无";
            }
            try {
              const wbEntries = await roche.worldbook.getEntries({});
              if (wbEntries && wbEntries.length > 0) {
                 worldbook = wbEntries.map(e => e.content || e.text).join('\n').substring(0, 1500);
              }
            } catch(e) {}
          } catch (e) {}
          return {
            sysPrompt: `【场景】：专属同频自习室\n【角色设定】：你是 ${session.charName}。严格遵循你的原本人设。\n【用户设定】：${session.userName} (${userBio})\n【世界书设定】：${worldbook}\n【你们的核心记忆】：${coreMem}\n【你们的历史事实记忆】：${factsMem}\n【你们最近的聊天】：\n${shortTerm}\n\n【当前任务】：你在自习室辅导陪伴用户。\n【输出格式要求】：\n1. 绝对不要使用“赛博朋克”、“AI助手”等出戏的自我称呼。\n2. 你的动作和神态描写必须使用 * * 包裹（例如 *微微皱眉*、*轻敲桌面*）。\n3. 你的对话部分，绝对不要带类似 “陈序：” 这样的前缀！直接输出你说的话和动作即可。\n4. 你现在是在用聊天软件发消息，请将你想说的话分为多句，每句话换一行。我会将你的每一行单独作为一个聊天气泡发送出去，制造连续发送多条消息的真实效果。`
          };
        };

        const updateClock = () => {
          const now = new Date();
          container.querySelector("#sr-clock").textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
          container.querySelector("#sr-date").textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`;
          const items = [{i:'☕',t:'冰美式'},{i:'🎧',t:'降噪耳机'},{i:'📚',t:'错题本'},{i:'🐈',t:'黑猫'},{i:'🪴',t:'多肉'}];
          const lucky = items[(now.getDate() + now.getMonth()) % items.length];
          container.querySelector("#sr-lucky-icon").textContent = lucky.i;
          container.querySelector("#sr-lucky-text").textContent = lucky.t;
          container.querySelector("#sr-lucky-num").textContent = (70 + (now.getDate() % 30)) + "%";
        };
        setInterval(updateClock, 1000); updateClock();

        try {
          const chars = await roche.character.list();
          ui.charSelect.innerHTML = '<option value="">选择羁绊...</option>' + chars.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
          const activeCharId = await roche.character.getActiveId();
          if (activeCharId) {
            ui.charSelect.value = activeCharId;
            ui.charSelect.dispatchEvent(new Event('change'));
          }
          const activeUser = await roche.persona.getActiveUserPersona();
          if(activeUser){ session.userName = activeUser.name || activeUser.handle || '我'; session.userAvatar = activeUser.avatar || ''; }
        } catch(e) {}

        const requestPomoQuote = async (intent) => {
          try {
             ui.pomoMsg.textContent = "TA正在思考...";
             const ctx = await buildContext();
             const sys = `${ctx.sysPrompt}\n\n当前场景：同频番茄钟。用户意图：[${intent}]。请用简短的一两句话（可以带动作描写 * *）作出回应，符合你的性格。直接说出你的话，不要加名字前缀。`;
             const res = await roche.ai.chat({ messages: [{role: "system", content: sys}], temperature: 0.8 });
             ui.pomoMsg.textContent = res.text;
          } catch(e) {
             ui.pomoMsg.textContent = "(无声的陪伴)";
          }
        };

        ui.pomoAction.onclick = async () => {
          if (session.isPomoRunning) {
            clearInterval(session.pomoTimer);
            session.isPomoRunning = false;
            session.pomoTimeLeft = 25 * 60;
            ui.pomoTimer.textContent = "25:00";
            ui.pomoAction.textContent = "开始专注";
            ui.pomoAction.style.background = "#E07A5F";
            ui.pomoMsg.textContent = "番茄钟已重置。";
          } else {
            session.isPomoRunning = true;
            ui.pomoAction.textContent = "放弃专注 (放弃)";
            ui.pomoAction.style.background = "#FF6B6B";
            await requestPomoQuote("我准备开始25分钟的专注，跟我说句话");
            
            session.pomoTimer = setInterval(async () => {
              session.pomoTimeLeft--;
              const m = Math.floor(session.pomoTimeLeft / 60);
              const s = session.pomoTimeLeft % 60;
              ui.pomoTimer.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
              
              if (session.pomoTimeLeft <= 0) {
                clearInterval(session.pomoTimer);
                session.isPomoRunning = false;
                ui.pomoTimer.textContent = "25:00";
                ui.pomoAction.textContent = "再来一个";
                ui.pomoAction.style.background = "#E07A5F";
                await requestPomoQuote("我成功坚持完了25分钟的专注，夸我或者嘲讽我");
                try {
                  const logPrompt = generateMemoryArchivalPrompt(`- 和 ${session.userName} 在同频自习室里一起完成了 25 分钟的番茄钟专注。`);
                  const sumRes = await roche.ai.chat({ messages: [{role:"system", content: logPrompt}], temperature: 0.4 });
                  await roche.memory.write({ conversationId: session.conversationId, action: "完成了番茄钟专注", summaryText: sumRes.text.trim(), who: [session.userName, session.charName], when: "刚刚", where: "专属讲堂", source: "plugin" });
                  roche.ui.toast("记忆已同步更新");
                } catch(e) {}
              }
            }, 1000);
          }
        };

                // --- 智能语义分章 ---
        const smartChunkText = (text, maxSize = 2500) => {
          let processedText = text.replace(/([。！？!?])/g, "$1\n");
          const lines = processedText.split('\n');
          
          // 如果全文少于 10000 字，直接作为一个大章节返回，不进行任何切分
          if (text.length < 10000) {
            return [{ title: "全文内容", content: text }];
          }
          
          const chunks = [];
          let currentChunk = "";
          let currentTitle = "引言/前言";
          const headerRegex = /^(第[\d零一二三四五六七八九十百千万]+[章回节讲篇单元]|Chapter\s*\d+|#{1,4}\s+)/i;
          
          for (let line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (headerRegex.test(trimmed)) {
              if (currentChunk.length > 100) {
                chunks.push({ title: currentTitle, content: currentChunk });
                currentChunk = line + '\n';
                currentTitle = trimmed.substring(0, 25);
              } else {
                currentTitle = trimmed.substring(0, 25);
                currentChunk += line + '\n';
              }
            } else {
              currentChunk += line + '\n';
              if (currentChunk.length >= maxSize) {
                chunks.push({ title: currentTitle, content: currentChunk });
                currentChunk = "";
                currentTitle = currentTitle.startsWith("继续:") ? currentTitle : "继续: " + currentTitle.substring(0, 15);
              }
            }
          }
          if (currentChunk.trim().length > 0) {
            chunks.push({ title: currentTitle, content: currentChunk });
          }
          return chunks.length > 0 ? chunks : [{ title: "全部内容", content: text.substring(0, maxSize) }];
        };

        const appendBubble = (type, text) => {
          const row = document.createElement("div");
          row.className = `msg-row ${type}`;
          if (type !== 'system') {
            const avatar = document.createElement("img");
            avatar.className = "msg-avatar";
            avatar.src = type === 'ai' ? (session.charAvatar || "https://api.dicebear.com/7.x/bottts/svg?seed=ai") : (session.userAvatar || "https://api.dicebear.com/7.x/bottts/svg?seed=user");
            avatar.onerror = () => avatar.style.display = 'none';
            row.appendChild(avatar);
          }
          const div = document.createElement("div");
          div.className = `sr-bubble ${type}`;
          let htmlText = text.replace(/\n/g, '<br/>');
          if (type === 'ai') {
            htmlText = htmlText.replace(new RegExp(`^${session.charName}[：:]\\s*`, 'i'), '');
          }
          div.innerHTML = htmlText;
          row.appendChild(div);
          ui.classBox.appendChild(row);
          ui.classBox.scrollTop = ui.classBox.scrollHeight;
        };
        
        const appendAiMessageInChunks = async (text) => {
           const parts = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
           for(let part of parts) {
               appendBubble("ai", part);
               await new Promise(r => setTimeout(r, 600)); 
           }
        };

        const loadScript = (src) => new Promise((resolve, reject) => {
          if(document.querySelector(`script[src="${src}"]`)) return resolve();
          const s = document.createElement('script');
          s.src = src; s.onload = resolve; s.onerror = reject;
          document.head.appendChild(s);
        });

        const parseFile = async (file) => {
          const ext = file.name.split('.').pop().toLowerCase();
          if (['txt', 'md', 'json', 'csv'].includes(ext)) return await file.text();
          if (ext === 'docx') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js');
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value;
          }
          if (ext === 'pdf') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js');
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let text = "";
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map(item => item.str).join(' ') + "\n";
            }
            return text;
          }
          throw new Error("不支持的文件格式");
        };

        // ====== 流程跳转逻辑 ======
        
        // 1. 历史记录加载
        const loadHistory = async () => {
            try {
                const db = await openDB();
                const tx = db.transaction("lectures", "readonly");
                const store = tx.objectStore("lectures");
                const req = store.getAll();
                req.onsuccess = () => {
                    const records = req.result.sort((a,b) => b.timestamp - a.timestamp);
                    ui.historyList.innerHTML = records.length === 0 ? '<div style="color:#999; font-size:12px; text-align:center; padding:20px;">暂无记录</div>' : '';
                    records.forEach(record => {
                        const item = document.createElement("div");
                        item.className = "chapter-list-item";
                                                item.innerHTML = `
                          <div>
                            <div class="chapter-title">${record.title}</div>
                            <div class="chapter-info">共 ${record.chunks?.length || 0} 个章节 | ${new Date(record.timestamp).toLocaleString()}</div>
                          </div>
                          <div style="display:flex; gap:8px;">
                            <button class="btn-mem" data-id="${record.id}" style="background:#8c9b8d; color:white; border:none; border-radius:4px; padding:4px 8px; cursor:pointer; font-size:12px;">写记忆</button>
                            <button class="btn-del" data-id="${record.id}" style="background:#d9534f; color:white; border:none; border-radius:4px; padding:4px 8px; cursor:pointer; font-size:12px;">删除</button>
                          </div>
                        `;
                        // 点击记录恢复，进入【章节选择页】
                        item.querySelector("div").onclick = () => {
                            session.documentChunks = record.chunks || [];
                            session.currentDocTitle = record.title;
                            session.classMessages = record.messages || []; // 这个其实已经没用了，因为我们是按章节新建课堂
                            renderChapterList();
                            ui.pageClassEntry.classList.remove("active");
                            ui.pageChapterList.classList.add("active");
                        };
                        item.querySelector(".btn-del").onclick = async (e) => {
                            e.stopPropagation();
                            if (confirm("确定删除这条课堂记录吗？")) {
                                const db = await openDB();
                                await db.transaction("lectures", "readwrite").objectStore("lectures").delete(record.id);
                                await loadHistory();
                            }
                        };

                        const btnMem = item.querySelector(".btn-mem");
                        if (btnMem) {
                            btnMem.onclick = async (e) => {
                                e.stopPropagation();
                                if (confirm("确定将这节课的讨论提取并写入 Roche 主记忆吗？(写入后不可在插件内撤销)")) {
                                    roche.ui.toast("正在提取记忆...");
                                    const logText = record.classMessages.filter(m => m.role !== 'system').map(m => `${m.role === 'assistant' ? record.charName : record.userName}: ${m.content}`).join('\n');
                                    try {
                                        const res = await roche.ai.chat({ messages: [{ role: "system", content: generateMemoryArchivalPrompt(logText) }], temperature: 0.3 });
                                        await roche.memory.write({
                                            conversationId: record.conversationId || roche.memory.currentConversationId,
                                            action: res.text.trim(),
                                            summaryText: res.text.trim(),
                                            who: [record.userName, record.charName],
                                            when: new Date().toLocaleString(),
                                            where: "专属讲堂",
                                            source: "plugin"
                                        });
                                        roche.ui.toast("记忆刻入完成！");
                                    } catch(err) { 
                                        roche.ui.toast("记忆写入失败: " + err.message); 
                                    }
                                }
                            };
                        }
                        ui.historyList.appendChild(item);
                    });
                };
            } catch(e) { console.error("DB Load Error", e); }
        };

        // 渲染章节列表 (层级 2)
        const renderChapterList = () => {
            ui.chapterListTitle.textContent = session.currentDocTitle || "课本目录";
            ui.chapterListContainer.innerHTML = "";
            session.documentChunks.forEach((chunk, idx) => {
                const item = document.createElement("div");
                item.className = "chapter-list-item";
                item.innerHTML = `
                  <div>
                    <div class="chapter-title">${chunk.title}</div>
                    <div class="chapter-info">约 ${chunk.content.length} 字</div>
                  </div>
                  <div style="color:#6D8B74; font-size:20px;">→</div>
                `;
                item.onclick = () => enterClassRoom(idx);
                ui.chapterListContainer.appendChild(item);
            });
        };

        // 进入课堂 (层级 3)
        const enterClassRoom = async (chunkIdx) => {
            session.currentChunkIdx = chunkIdx;
            const chunkData = session.documentChunks[chunkIdx];
            if(!chunkData) return;
            
            ui.pageChapterList.classList.remove("active");
            ui.pageClass.classList.add("active");
            ui.currentClassTitle.textContent = chunkData.title;
            
            // 绑定查看原文按钮，使用当前的 chunkIdx
            if(ui.viewDocBtn) {
                ui.viewDocBtn.onclick = () => {
                    if(session.documentChunks && session.documentChunks[chunkIdx]) {
                        ui.docModalContent.textContent = session.documentChunks[chunkIdx].content;
                        ui.docModal.style.display = "flex";
                    } else {
                        roche.ui.toast("当前章节没有资料原文");
                    }
                };
            }
            if(ui.closeDocModal) {
                ui.closeDocModal.onclick = () => {
                    ui.docModal.style.display = "none";
                };
            }

            
            ui.classBox.innerHTML = "";
            session.classMessages = [];
            
            appendBubble("system", `正在准备【${chunkData.title}】的课堂...`);
            
            try {
              const ctx = await buildContext();
              const sysPrompt = `${ctx.sysPrompt}\n\n【本节课的学习资料 (${chunkData.title})】：\n${chunkData.content}\n\n【任务指令】：\n主动和用户打招呼，用你的口吻概括这段资料的核心内容，并引导用户开始复习或提问。`;
              
              session.classMessages.push({ role: "system", content: sysPrompt });
              session.classMessages.push({ role: "user", content: `我准备好上这节课了：《${chunkData.title}》` });
              
              ui.classInput.disabled = true; ui.classSend.disabled = true;
              const result = await roche.ai.chat({ messages: session.classMessages, temperature: 0.7 });
              session.classMessages.push({ role: "assistant", content: result.text });
              ui.classBox.innerHTML = ""; // 清除系统提示
              await appendAiMessageInChunks(result.text);
            } catch(e) {
              appendBubble("system", "讲师准备失败: " + e.message);
            } finally {
              ui.classInput.disabled = false; ui.classSend.disabled = false; ui.classInput.focus();
            }
        };

        // 绑定事件：大厅 -> 资料室
        ui.btnClassEntry.onclick = () => {
            if(checkAuth()) {
                ui.home.style.display = "none";
                ui.pageClassEntry.classList.add("active");
                loadHistory();
            }
        };
        
        // 绑定事件：资料室 -> 大厅
        ui.backFromClassEntry.onclick = () => {
            ui.pageClassEntry.classList.remove("active");
            ui.home.style.display = "flex";
        };
        
        // 绑定事件：资料室上传文件 -> 解析 -> 章节列表
        ui.fileEntry.addEventListener('change', async (e) => {
          const file = e.target.files[0];
          if(!file) return;
          
          ui.fileEntry.disabled = true;
          roche.ui.toast(`正在全力解析 [${file.name}]...`);
          try {
            let text = await parseFile(file);
            session.documentChunks = smartChunkText(text, 2500);
            session.currentDocTitle = file.name.replace(/\.[^/.]+$/, "");
            
            // 保存到历史记录
            try {
               const db = await openDB();
               const tx = db.transaction("lectures", "readwrite");
               tx.objectStore("lectures").add({
                   timestamp: Date.now(),
                   title: session.currentDocTitle,
                   chunks: [...session.documentChunks],
                   messages: []
               });
            } catch(dbErr) { console.error("DB Save Error", dbErr); }
            
            ui.pageClassEntry.classList.remove("active");
            ui.pageChapterList.classList.add("active");
            renderChapterList();
          } catch(err) {
            roche.ui.toast("解析失败: " + err.message);
          } finally {
            ui.fileEntry.value = "";
            ui.fileEntry.disabled = false;
          }
        });
        
        // 绑定事件：章节列表 -> 资料室
        ui.backFromChapterList.onclick = () => {
            ui.pageChapterList.classList.remove("active");
            ui.pageClassEntry.classList.add("active");
            loadHistory();
        };
        
        // 绑定事件：课堂 -> 章节列表 (退出课堂，刻入记忆)
        ui.backFromClass.onclick = async () => {
          ui.pageClass.classList.remove("active");
          ui.pageChapterList.classList.add("active");
          // 只保存到本地数据库，不自动写入主记忆
          try {
            const db = await openDB();
            const tx = db.transaction("class_records", "readwrite");
            const store = tx.objectStore("class_records");
            await store.put(session);
          } catch (e) { console.error("自动保存到本地失败", e); }
        };

        // ====== 聊天逻辑 ======
        ui.classSend.onclick = async () => {
          const text = ui.classInput.value.trim();
          if(!text) return;
          ui.classInput.value = "";
          appendBubble("user", text);
          
          session.classMessages.push({ role: "user", content: text });
          ui.classInput.disabled = true; ui.classSend.disabled = true;
          try {
            const result = await roche.ai.chat({ messages: session.classMessages, temperature: 0.7 });
            session.classMessages.push({ role: "assistant", content: result.text });
            await appendAiMessageInChunks(result.text);
          } catch(err) {
            appendBubble("system", "回复失败: " + err.message);
          } finally {
            ui.classInput.disabled = false; ui.classSend.disabled = false; ui.classInput.focus();
          }
        };
        
        ui.classInput.addEventListener("keypress", (e) => {
            if(e.key === "Enter" && !ui.classSend.disabled) ui.classSend.click();
        });

        ui.classExport.onclick = () => {
          if(session.classMessages.length <= 1) return;
          let out = `【${session.charName} 的讲堂笔记: ${session.currentClassTitle}】\n\n`;
          session.classMessages.forEach(m => {
            if(m.role === 'user') out += `${session.userName}: ${m.content}\n\n`;
            else if(m.role === 'assistant') out += `${session.charName}: ${m.content}\n\n`;
          });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([out], { type: "text/plain" }));
          a.download = `笔记_${session.currentClassTitle}.txt`; a.click();
        };

          

      },
      async unmount(container) {
        container.replaceChildren();
        const s = document.getElementById("roche-plugin-study-style");
        if(s) s.remove();
      }
    }
  ]
});
