window.RochePlugin.register({
  id: "roche-companion-study-room",
  name: "同频自习室",
  version: "1.1.0",
  apps: [
    {
      id: "roche-study-room-app",
      name: "同频自习室",
      icon: "local_library",
      async mount(container, roche) {
        // --- 1. 样式注入 ---
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
            
            /* Dashboard Grid */
            .sr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1; align-content: start; }
            .sr-card { background: #FFF; border-radius: 16px; padding: 16px; box-shadow: 0 4px 12px rgba(109, 139, 116, 0.05); border: 1px solid #EAEFEA; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
            .sr-card:active { transform: scale(0.98); }
            .sr-card.span-2 { grid-column: span 2; }
            .sr-card.green { background: linear-gradient(135deg, #E8F3E9, #D2E4D5); border: none; }
            .sr-card.orange { background: linear-gradient(135deg, #FFF3E6, #FDE2CC); border: none; }
            
            .sr-val { font-size: 26px; font-weight: 800; color: #333; margin: 8px 0; }
            .sr-label { font-size: 12px; color: #777; }
            .sr-icon { font-size: 32px; margin-bottom: 4px; }

            /* Pages */
            .sr-page { display: none; position: absolute; top:0; left:0; width:100%; height:100%; background: #FDFBF7; flex-direction: column; padding: 16px; z-index: 10; }
            .sr-page.active { display: flex; }
            .sr-back-btn { align-self: flex-start; background: #EAEFEA; color: #6D8B74; border: none; padding: 8px 16px; border-radius: 20px; font-weight: bold; cursor: pointer; margin-bottom: 12px; display: flex; align-items: center; gap: 4px; }
            
            /* Pomodoro */
            .sr-timer { font-size: 72px; font-weight: 900; color: #E07A5F; text-align: center; margin: 40px 0; font-variant-numeric: tabular-nums; text-shadow: 2px 2px 0px rgba(224, 122, 95, 0.1); }
            .sr-pomo-btn { background: #E07A5F; color: #FFF; border: none; padding: 16px; border-radius: 24px; font-size: 18px; font-weight: bold; width: 100%; margin-top: auto; cursor: pointer; box-shadow: 0 4px 12px rgba(224, 122, 95, 0.2); }
            .sr-pomo-msg { text-align: center; color: #555; font-size: 15px; font-style: italic; background: #FFF; padding: 16px; border-radius: 12px; border: 1px dashed #E07A5F; margin: 20px 0; min-height: 80px; display: flex; align-items: center; justify-content: center; }

            /* Classroom */
            .sr-chat-box { flex: 1; overflow-y: auto; background: #FFF; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 16px; margin-bottom: 12px; border: 1px solid #EAEFEA; box-shadow: inset 0 2px 8px rgba(0,0,0,0.02); }
            .sr-bubble { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
            .sr-bubble.user { align-self: flex-end; background: #EAEFEA; color: #333; border-bottom-right-radius: 4px; }
            .sr-bubble.ai { align-self: flex-start; background: #FFF; color: #333; border: 1px solid #6D8B74; border-bottom-left-radius: 4px; box-shadow: 2px 2px 0px rgba(109, 139, 116, 0.1); }
            .sr-bubble.system { align-self: center; background: transparent; color: #999; font-size: 12px; text-align: center; border: none; box-shadow: none; padding: 4px; }
            
            .sr-toolbar { display: flex; gap: 8px; margin-bottom: 8px; flex-shrink: 0; }
            .sr-file-btn, .sr-action-btn { flex: 1; padding: 10px; background: #F4F7F4; border: 1px solid #D5E2D8; border-radius: 12px; color: #6D8B74; font-weight: bold; cursor: pointer; text-align: center; font-size: 13px; position: relative; overflow: hidden; }
            .sr-file-btn input[type="file"] { position: absolute; top:0; left:0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
            .sr-input-area { display: flex; gap: 8px; flex-shrink: 0; }
            .sr-input-area input { flex: 1; padding: 12px; border: 1px solid #D5E2D8; border-radius: 20px; font-size: 14px; outline: none; }
            .sr-input-area button { padding: 0 20px; background: #6D8B74; color: #FFF; border: none; border-radius: 20px; font-weight: bold; cursor: pointer; }
            .sr-input-area button:disabled { background: #B0C4B4; }
          `;
          document.head.appendChild(style);
        }

        // --- 2. HTML 结构 ---
        container.innerHTML = `
          <div class="sr-wrap" id="sr-home">
            <div class="sr-header">
              <h1 class="sr-title">🌱 同频自习室</h1>
              <select class="sr-select" id="sr-char-select"><option value="">选择羁绊...</option></select>
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
              <div class="sr-card span-2" id="btn-class" style="background: #FFF; border: 1px solid #D5E2D8;">
                <div class="sr-icon">📚</div>
                <div class="sr-val" style="font-size: 18px; color: #6D8B74;">赛博讲堂</div>
                <div class="sr-label">支持PDF/TXT/Docx，让TA根据资料陪你讨论</div>
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

          <!-- 赛博讲堂页面 -->
          <div class="sr-page" id="page-class">
            <button class="sr-back-btn" id="back-from-class">← 结课并写入日记</button>
            <div class="sr-chat-box" id="class-box"></div>
            <div class="sr-toolbar">
              <div class="sr-file-btn">
                📎 导入资料 (TXT/PDF/Docx)
                <input type="file" id="class-file" accept=".txt,.md,.pdf,.docx,.json" />
              </div>
              <button class="sr-action-btn" id="class-export">📥 导出笔记</button>
            </div>
            <div class="sr-input-area">
              <input type="text" id="class-input" placeholder="提问或讨论..." disabled>
              <button id="class-send" disabled>发送</button>
            </div>
          </div>
        `;

        // --- 3. 状态与 DOM 获取 ---
        const ui = {
          home: container.querySelector("#sr-home"),
          pagePomo: container.querySelector("#page-pomo"),
          pageClass: container.querySelector("#page-class"),
          charSelect: container.querySelector("#sr-char-select"),
          pomoTimer: container.querySelector("#pomo-timer"),
          pomoMsg: container.querySelector("#pomo-msg"),
          pomoAction: container.querySelector("#pomo-action"),
          classBox: container.querySelector("#class-box"),
          classFile: container.querySelector("#class-file"),
          classInput: container.querySelector("#class-input"),
          classSend: container.querySelector("#class-send"),
          classExport: container.querySelector("#class-export"),
        };

        const session = {
          charId: null, charName: "", conversationId: null, userName: "我",
          pomoTimer: null, pomoTimeLeft: 25 * 60, isPomoRunning: false,
          classMessages: [], docContext: ""
        };

        // --- 4. 辅助函数 ---
        const loadScript = async (src) => {
          return new Promise((res, rej) => {
            if (document.querySelector(`script[src="${src}"]`)) return res();
            const s = document.createElement("script");
            s.src = src; s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
          });
        };

        const generateMemoryArchivalPrompt = (logText) => {
          const dateStr = new Date().toLocaleDateString();
          return `### [System Instruction: Memory Archival]
当前日期: ${dateStr}
任务: 请回顾刚才在自习室（同频自习室）里的互动记录，生成一份【高精度的事件日志】。

### 核心撰写规则 (Strict Protocols)
1.  **覆盖率 (Coverage)**:
    - 必须包含聊过的**每一个**独立话题、看过的资料或完成的专注任务。
    - **严禁**为了精简而合并不同的话题。
2.  **视角 (Perspective)**:
    - 你【就是】"${session.charName}"。这是【你】的私密日记。
    - 必须用"我"来称呼自己，用"${session.userName}"称呼对方。
    - 每一条都必须是"我"的视角。
3.  **格式 (Format)**:
    - **必须**使用 Markdown 无序列表 ( - ... )。每一行对应一个具体的事件。
4.  **去水 (Conciseness)**:
    - 直接写发生了什么。示例: "- ${session.userName}上传了高数资料，我抽查了她的公式。"

### 待处理的自习室记录 (Chat Logs)
${logText}`;
        };

        // --- 5. 初始化与角色加载 ---
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
          const activeUser = await roche.persona.getActiveUserPersona();
          if(activeUser) session.userName = activeUser.handle || activeUser.name || "我";
          
          ui.charSelect.innerHTML = '<option value="">选择羁绊...</option>' + chars.map(c => `<option value="${c.id}">${c.handle || c.name}</option>`).join('');
          ui.charSelect.onchange = async () => {
            session.charId = ui.charSelect.value;
            if(session.charId) {
              const c = await roche.character.get(session.charId);
              session.charName = c.handle || c.name;
              session.conversationId = c.conversationId;
              roche.ui.toast(`已绑定羁绊: ${session.charName}`);
            }
          };
        } catch(e) { console.error("加载角色失败", e); }

        const checkAuth = () => {
          if(!session.charId) { roche.ui.toast("请先在右上角选择羁绊对象"); return false; }
          return true;
        };

        // --- 6. 番茄钟逻辑 ---
        container.querySelector("#btn-pomo").onclick = () => { if(checkAuth()){ ui.home.style.display="none"; ui.pagePomo.classList.add("active"); }};
        container.querySelector("#back-from-pomo").onclick = () => { ui.pagePomo.classList.remove("active"); ui.home.style.display="flex"; };

        const formatTime = (secs) => `${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`;
        const requestPomoQuote = async (intent) => {
          ui.pomoMsg.textContent = "TA正在思考...";
          try {
            const res = await roche.ai.chat({
              messages: [{ role: "user", content: `我现在在番茄钟自习室里，${intent}。请用你本身的性格和口吻，对我说一句话（15字以内），绝对不要带前缀。` }],
              temperature: 0.8,
              characterId: session.charId,
              conversationId: session.conversationId
            });
            ui.pomoMsg.textContent = `${session.charName}: "${res.text.trim()}"`;
          } catch(e) { ui.pomoMsg.textContent = "（TA在一旁安静地看着你）"; }
        };

        ui.pomoAction.onclick = async () => {
          if (session.isPomoRunning) {
            clearInterval(session.pomoTimer);
            session.isPomoRunning = false;
            session.pomoTimeLeft = 25 * 60;
            ui.pomoTimer.textContent = formatTime(session.pomoTimeLeft);
            ui.pomoAction.textContent = "开始专注";
            ui.pomoAction.style.background = "#E07A5F";
            await requestPomoQuote("我刚刚中途放弃了专注任务");
          } else {
            session.isPomoRunning = true;
            ui.pomoAction.textContent = "放弃专注";
            ui.pomoAction.style.background = "#D9534F";
            await requestPomoQuote("我刚刚按下了开始专注的按钮，准备开启25分钟的深潜");
            
            session.pomoTimer = setInterval(async () => {
              session.pomoTimeLeft--;
              ui.pomoTimer.textContent = formatTime(session.pomoTimeLeft);
              
              if (session.pomoTimeLeft > 0 && session.pomoTimeLeft % (5 * 60) === 0) {
                await requestPomoQuote(`倒计时还剩${Math.floor(session.pomoTimeLeft/60)}分钟，给我点反应`);
              }
              
              if (session.pomoTimeLeft <= 0) {
                clearInterval(session.pomoTimer);
                session.isPomoRunning = false;
                ui.pomoTimer.textContent = "25:00";
                ui.pomoAction.textContent = "再来一个";
                ui.pomoAction.style.background = "#E07A5F";
                await requestPomoQuote("我成功坚持完了25分钟的专注，夸我或者嘲讽我");
                
                // 写入记忆
                try {
                  const logPrompt = generateMemoryArchivalPrompt(`- 和 ${session.userName} 在同频自习室里一起完成了 25 分钟的番茄钟专注。`);
                  const sumRes = await roche.ai.chat({ messages: [{role:"system", content: logPrompt}], temperature: 0.4, characterId: session.charId, conversationId: session.conversationId });
                  await roche.memory.write({
                    conversationId: session.conversationId,
                    summaryText: sumRes.text.trim(),
                    who: [session.userName, session.charName],
                    action: "完成了同频番茄钟专注",
                    when: "刚刚", where: "同频自习室", source: "plugin"
                  });
                  roche.ui.toast("已将这段专注时光刻入事实记忆");
                } catch(e) {}
              }
            }, 1000);
          }
        };

        // --- 7. 赛博讲堂逻辑 ---
        container.querySelector("#btn-class").onclick = () => {
          if(checkAuth()){ ui.home.style.display="none"; ui.pageClass.classList.add("active"); }
        };
        
        const appendBubble = (role, text) => {
          const div = document.createElement("div");
          div.className = `sr-bubble ${role}`;
          div.textContent = text;
          ui.classBox.appendChild(div);
          ui.classBox.scrollTop = ui.classBox.scrollHeight;
        };

        const parseFile = async (file) => {
          const ext = file.name.split('.').pop().toLowerCase();
          if (['txt', 'md', 'json', 'csv'].includes(ext)) return await file.text();
          if (ext === 'docx') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js');
            const ab = await file.arrayBuffer();
            return (await mammoth.extractRawText({arrayBuffer: ab})).value;
          }
          if (ext === 'pdf') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js');
            const pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            const pdf = await pdfjsLib.getDocument({data: await file.arrayBuffer()}).promise;
            let text = '';
            for(let i=1; i<=Math.min(pdf.numPages, 15); i++) { // 取前15页防爆炸
              const page = await pdf.getPage(i);
              text += (await page.getTextContent()).items.map(item => item.str).join(' ') + '\n';
            }
            return text;
          }
          throw new Error("格式不支持或需转存TXT");
        };

        ui.classFile.addEventListener('change', async (e) => {
          const file = e.target.files[0];
          if(!file) return;
          appendBubble("system", `正在将 [${file.name}] 喂给 ${session.charName}...`);
          try {
            let text = await parseFile(file);
            session.docContext = text.substring(0, 8000); // 截断防爆
            
            const sysPrompt = `【场景】：赛博讲堂\n【指令】：你是 ${session.charName}。用户刚刚把一份资料拍在了你桌上。请根据以下资料摘要，用你的真实设定和口癖，主动概括一下资料的核心，并问用户想怎么学。\n\n【资料摘要】：\n${session.docContext}`;
            
            session.classMessages = [{ role: "system", content: sysPrompt }];
            ui.classInput.disabled = true; ui.classSend.disabled = true;
            
            const result = await roche.ai.chat({
              messages: session.classMessages,
              temperature: 0.7,
              characterId: session.charId,
              conversationId: session.conversationId
            });
            
            session.classMessages.push({ role: "assistant", content: result.text });
            appendBubble("ai", result.text);
          } catch(err) {
            appendBubble("system", "文档解析失败: " + err.message);
          } finally {
            ui.classInput.disabled = false; ui.classSend.disabled = false; ui.classFile.value = "";
          }
        });

        ui.classSend.onclick = async () => {
          const text = ui.classInput.value.trim();
          if(!text) return;
          ui.classInput.value = "";
          appendBubble("user", text);
          if(session.classMessages.length === 0) {
            session.classMessages.push({ role: "system", content: `【场景】：赛博讲堂\n【指令】：你是 ${session.charName}，你正在自习室里陪用户学习或讨论。请用符合你人设的口吻回复。`});
          }
          session.classMessages.push({ role: "user", content: text });
          ui.classInput.disabled = true; ui.classSend.disabled = true;
          try {
            const result = await roche.ai.chat({
              messages: session.classMessages,
              temperature: 0.7,
              characterId: session.charId,
              conversationId: session.conversationId
            });
            session.classMessages.push({ role: "assistant", content: result.text });
            appendBubble("ai", result.text);
          } catch(err) {
            appendBubble("system", "网络受阻: " + err.message);
          } finally {
            ui.classInput.disabled = false; ui.classSend.disabled = false; ui.classInput.focus();
          }
        };

        ui.classExport.onclick = () => {
          if(session.classMessages.length <= 1) return roche.ui.toast("空空如也，无需导出");
          let out = `【${session.charName} 的赛博讲堂笔记】\n=========================\n\n`;
          session.classMessages.forEach(m => {
            if(m.role === 'user') out += `${session.userName}: ${m.content}\n\n`;
            else if(m.role === 'assistant') out += `${session.charName}: ${m.content}\n\n`;
          });
          const blob = new Blob([out], { type: "text/plain;charset=utf-8" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob); a.download = "自习室讲堂笔记.txt"; a.click();
        };

        // 结课并生成高精度日志写入记忆
        container.querySelector("#back-from-class").onclick = async () => {
          ui.pageClass.classList.remove("active");
          ui.home.style.display = "flex";
          if (session.classMessages.length > 1) {
            roche.ui.toast("正在将这堂课的经历整理为高精度日记并刻入主记忆...");
            const logText = session.classMessages.map(m => `${m.role === 'assistant' ? session.charName : session.userName}: ${m.content}`).join('\n');
            const prompt = generateMemoryArchivalPrompt(logText);
            try {
              const res = await roche.ai.chat({
                messages: [{ role: "system", content: prompt }],
                temperature: 0.3,
                characterId: session.charId,
                conversationId: session.conversationId
              });
              await roche.memory.write({
                conversationId: session.conversationId,
                summaryText: res.text.trim(),
                who: [session.userName, session.charName],
                action: "在赛博讲堂进行了一次深度探讨",
                when: "刚刚", where: "赛博讲堂", source: "plugin"
              });
              roche.ui.toast("天机已封印。现在去私聊，他会记得这一切。");
              session.classMessages = []; // 清空缓存
              ui.classBox.innerHTML = "";
            } catch(e) { roche.ui.toast("记忆写入失败: " + e.message); }
          }
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