window.RochePlugin.register({
  id: "sully-study-room",
  name: "同频自习室",
  version: "1.0.0",
  description: "高颜值陪伴自习室。包含番茄钟、幸运物、以及支持导入文档的赛博讲堂。",
  apps: [
    {
      id: "sully-study-room-app",
      name: "同频自习室",
      icon: "local_cafe",
      async mount(container, roche) {
        const styleId = "roche-plugin-study-style";
        if (!document.getElementById(styleId)) {
          const style = document.createElement("style");
          style.id = styleId;
          style.textContent = `
            .sully-sr-wrap {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #FFF9F2;
              color: #333;
              height: 100%; width: 100%;
              overflow-y: auto;
              display: flex; flex-direction: column;
              box-sizing: border-box; padding: 16px;
              --c-orange: #FF9E5E; --c-green: #A8D8B9; --c-blue: #A2D2FF; --c-card: #FFFFFF;
            }
            .sully-sr-wrap * { box-sizing: border-box; }
            .sr-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .sr-header h1 { margin: 0; font-size: 22px; color: #4A4A4A; display: flex; align-items: center; gap: 8px; }
            .sr-char-select { padding: 6px 12px; border-radius: 20px; border: 1px solid #DDD; font-size: 14px; outline: none; background: #FFF; }
            
            .sr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .sr-card { background: var(--c-card); border-radius: 20px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
            .sr-card:active { transform: scale(0.97); }
            .sr-card.col-span-2 { grid-column: span 2; }
            .sr-card.orange { background: linear-gradient(135deg, #FFDFD0, #FFD0B8); }
            .sr-card.green { background: linear-gradient(135deg, #E6F7ED, #D0F0DE); }
            
            .sr-card-title { font-size: 14px; color: #666; margin-bottom: 8px; font-weight: bold; }
            .sr-card-val { font-size: 28px; font-weight: 800; color: #333; }
            .sr-card-icon { font-size: 40px; margin-bottom: 10px; }

            /* Pages */
            .sr-page { display: none; flex-direction: column; height: 100%; background: #FFF9F2; position: absolute; top:0; left:0; width:100%; z-index: 10; padding: 16px; }
            .sr-page.active { display: flex; }
            .sr-back-btn { align-self: flex-start; background: #EEE; border:none; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 16px; cursor: pointer; }
            
            /* Pomodoro */
            .sr-timer { font-size: 72px; font-weight: 900; color: var(--c-orange); text-align: center; margin: 40px 0; font-variant-numeric: tabular-nums; }
            .sr-pomo-btn { background: var(--c-orange); color: #FFF; border: none; padding: 16px; border-radius: 30px; font-size: 18px; font-weight: bold; width: 100%; margin-bottom: 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(255,158,94,0.3); }
            .sr-pomo-msg { text-align: center; color: #666; font-size: 15px; min-height: 48px; font-style: italic; }

            /* Classroom */
            .sr-class-box { flex: 1; overflow-y: auto; background: #FFF; border-radius: 16px; padding: 12px; display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
            .sr-bubble { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 15px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
            .sr-bubble.user { align-self: flex-end; background: #F0F0F0; color: #333; border-bottom-right-radius: 4px; }
            .sr-bubble.ai { align-self: flex-start; background: #FFF; color: #333; border: 1px solid #EEE; border-bottom-left-radius: 4px; box-shadow: 2px 2px 0px rgba(0,0,0,0.05); }
            .sr-bubble.system { align-self: center; background: transparent; color: #999; font-size: 12px; text-align: center; border: none; box-shadow: none; }
            .sr-input-area { display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
            .sr-input-area input[type="text"] { flex: 1; padding: 12px; border: 1px solid #DDD; border-radius: 20px; font-size: 15px; outline: none; min-width: 200px; }
            .sr-input-area button { padding: 12px 20px; border: none; border-radius: 20px; font-weight: bold; cursor: pointer; background: var(--c-green); color: #2B4E38; }
            .sr-toolbar { display: flex; gap: 8px; width: 100%; }
            .sr-toolbar button { flex: 1; background: #EEE; color: #555; }
            .sr-file-btn { position: relative; overflow: hidden; background: #A2D2FF !important; color: #1E446B !important; }
            .sr-file-btn input[type="file"] { position: absolute; top:0; left:0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
          `;
          document.head.appendChild(style);
        }

        container.innerHTML = `
          <div class="sully-sr-wrap" id="sr-home">
            <div class="sr-header">
              <h1>🌱 自习室</h1>
              <select class="sr-char-select" id="sr-char-select"><option value="">选择同桌</option></select>
            </div>
            <div class="sr-grid">
              <div class="sr-card col-span-2 orange" id="card-time">
                <div class="sr-card-title">AM</div>
                <div class="sr-card-val" id="sr-clock">--:--:--</div>
                <div style="font-size:12px; color:#888; margin-top:4px;" id="sr-date">----年--月--日</div>
              </div>
              <div class="sr-card">
                <div class="sr-card-title">今日幸运物</div>
                <div class="sr-card-icon" id="sr-lucky-icon">🎁</div>
                <div style="font-size:14px; font-weight:bold;" id="sr-lucky-text">--</div>
              </div>
              <div class="sr-card green">
                <div class="sr-card-title">幸运指数</div>
                <div class="sr-card-val" id="sr-lucky-num">--%</div>
                <div style="font-size:12px; color:#666;">宜学习</div>
              </div>
              <div class="sr-card col-span-2" id="btn-open-pomo" style="background: #E8F0FE; border: 1px solid #DCE6F5;">
                <div class="sr-card-icon">🍅</div>
                <div class="sr-card-val" style="font-size:20px;">专注番茄钟</div>
                <div style="font-size:12px; color:#666; margin-top:4px;">纯净陪伴，拒绝分心</div>
              </div>
              <div class="sr-card col-span-2" id="btn-open-class" style="background: #FDF3E7; border: 1px solid #F5E6D3;">
                <div class="sr-card-icon">📚</div>
                <div class="sr-card-val" style="font-size:20px;">赛博讲堂</div>
                <div style="font-size:12px; color:#666; margin-top:4px;">上传资料 (PDF/Docx/TXT)，让TA给你上课</div>
              </div>
            </div>
          </div>

          <!-- 番茄钟页面 -->
          <div class="sr-page" id="page-pomo">
            <button class="sr-back-btn">← 返回</button>
            <h2 style="text-align:center; color:#333;">同频专注</h2>
            <div class="sr-timer" id="pomo-timer">25:00</div>
            <div class="sr-pomo-msg" id="pomo-msg">"准备好了就开始吧。"</div>
            <button class="sr-pomo-btn" id="pomo-action">开始专注</button>
          </div>

          <!-- 赛博讲堂页面 -->
          <div class="sr-page" id="page-class">
            <button class="sr-back-btn">← 返回</button>
            <h2 style="text-align:center; color:#333; margin-top:0;">📚 赛博讲堂</h2>
            <div class="sr-class-box" id="class-chat-box"></div>
            <div class="sr-input-area">
              <div class="sr-toolbar">
                <button class="sr-file-btn">
                  📎 上传资料
                  <input type="file" id="class-file" accept=".txt,.md,.pdf,.docx,.doc" />
                </button>
                <button id="class-export">📥 导出笔记</button>
              </div>
              <div style="display:flex; width:100%; gap:8px;">
                <input type="text" id="class-input" placeholder="提问或讨论..." disabled>
                <button id="class-send" disabled>发送</button>
              </div>
            </div>
          </div>
        `;

        // --- 逻辑与状态 ---
        const ui = {
          home: container.querySelector("#sr-home"),
          pomoPage: container.querySelector("#page-pomo"),
          classPage: container.querySelector("#page-class"),
          backBtns: container.querySelectorAll(".sr-back-btn"),
          charSelect: container.querySelector("#sr-char-select"),
          fileInput: container.querySelector("#class-file"),
          classBox: container.querySelector("#class-chat-box"),
          classInput: container.querySelector("#class-input"),
          classSend: container.querySelector("#class-send"),
          classExport: container.querySelector("#class-export"),
          pomoTimer: container.querySelector("#pomo-timer"),
          pomoMsg: container.querySelector("#pomo-msg"),
          pomoAction: container.querySelector("#pomo-action"),
        };

        let session = {
          charId: null, charName: "", conversationId: null, docText: "", messages: [],
          pomoInterval: null, pomoTimeLeft: 25 * 60, pomoRunning: false
        };

        // 加载外部库工具函数
        const loadScript = async (src) => {
          return new Promise((res, rej) => {
            if(document.querySelector(`script[src="${src}"]`)) return res();
            const s = document.createElement("script");
            s.src = src; s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
          });
        };

        // 1. 初始化主页小组件
        const initWidgets = () => {
          const updateClock = () => {
            const now = new Date();
            container.querySelector("#sr-clock").textContent = now.toTimeString().split(' ')[0];
            container.querySelector("#card-time .sr-card-title").textContent = now.getHours() >= 12 ? "PM" : "AM";
          };
          setInterval(updateClock, 1000); updateClock();
          const now = new Date();
          container.querySelector("#sr-date").textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`;
          
          // 伪随机幸运物
          const items = [ {i:'☕',t:'冰美式'}, {i:'🎧',t:'降噪耳机'}, {i:'📚',t:'好书'}, {i:'🐈',t:'小黑猫'}, {i:'🪴',t:'多肉植物'}, {i:'🍬',t:'薄荷糖'} ];
          const seed = now.getDate() + now.getMonth();
          const lucky = items[seed % items.length];
          container.querySelector("#sr-lucky-icon").textContent = lucky.i;
          container.querySelector("#sr-lucky-text").textContent = lucky.t;
          container.querySelector("#sr-lucky-num").textContent = (60 + (seed % 40)) + "%";
        };
        initWidgets();

        // 2. 加载角色
        try {
          const chars = await roche.character.list();
          ui.charSelect.innerHTML = '<option value="">选择同桌</option>' + chars.map(c => `<option value="${c.id}">${c.handle || c.name}</option>`).join('');
          ui.charSelect.onchange = async () => {
            session.charId = ui.charSelect.value;
            if(session.charId) {
              const c = await roche.character.get(session.charId);
              session.charName = c.handle || c.name;
              session.conversationId = c.conversationId;
              roche.ui.toast(`已选择同桌: ${session.charName}`);
            }
          };
        } catch(e) { console.error("角色加载失败", e); }

        // 页面切换
        const switchPage = (page) => {
          if(!session.charId) return roche.ui.toast("请先在主页右上角选择同桌");
          ui.home.style.display = "none";
          ui.pomoPage.classList.remove("active");
          ui.classPage.classList.remove("active");
          page.classList.add("active");
        };
        ui.backBtns.forEach(btn => btn.onclick = () => {
          ui.home.style.display = "flex";
          ui.pomoPage.classList.remove("active");
          ui.classPage.classList.remove("active");
        });
        container.querySelector("#btn-open-pomo").onclick = () => switchPage(ui.pomoPage);
        container.querySelector("#btn-open-class").onclick = () => switchPage(ui.classPage);

        // --- 番茄钟逻辑 ---
        const formatTime = (secs) => `${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`;
        const pomoQuotes = ["翻书声...", "别发呆，看着你的任务。", "我就在这里。", "喝口水吧。", "专心点。"];
        ui.pomoAction.onclick = async () => {
          if(session.pomoRunning) {
            // 放弃
            clearInterval(session.pomoInterval);
            session.pomoRunning = false;
            session.pomoTimeLeft = 25 * 60;
            ui.pomoTimer.textContent = formatTime(session.pomoTimeLeft);
            ui.pomoAction.textContent = "开始专注";
            ui.pomoAction.style.background = "var(--c-orange)";
            ui.pomoMsg.textContent = `${session.charName}: "就这？这么快就放弃了？"`;
          } else {
            // 开始
            session.pomoRunning = true;
            ui.pomoAction.textContent = "放弃专注";
            ui.pomoAction.style.background = "#FF5E5E";
            ui.pomoMsg.textContent = `${session.charName}: "开始计时了，别让我看不起你。"`;
            session.pomoInterval = setInterval(async () => {
              session.pomoTimeLeft--;
              ui.pomoTimer.textContent = formatTime(session.pomoTimeLeft);
              if(session.pomoTimeLeft % 300 === 0 && session.pomoTimeLeft > 0) {
                ui.pomoMsg.textContent = `${session.charName}: "${pomoQuotes[Math.floor(Math.random()*pomoQuotes.length)]}"`;
              }
              if(session.pomoTimeLeft <= 0) {
                clearInterval(session.pomoInterval);
                session.pomoRunning = false;
                ui.pomoTimer.textContent = "完成!";
                ui.pomoAction.textContent = "再来一个";
                ui.pomoAction.style.background = "var(--c-orange)";
                ui.pomoMsg.textContent = `${session.charName}: "还不错嘛，居然坚持下来了。"`;
                // 写入记忆
                try {
                  await roche.memory.write({
                    conversationId: session.conversationId,
                    summaryText: `[自习室] 用户和${session.charName}一起安静地完成了一个25分钟的番茄钟专注。`,
                    who: ["用户", session.charName],
                    action: "完成了25分钟专注",
                    when: "刚刚", where: "自习室", source: "plugin"
                  });
                  roche.ui.toast("专注记录已刻入记忆");
                }catch(e){}
              }
            }, 1000);
          }
        };

        // --- 赛博讲堂逻辑 ---
        const appendClassMsg = (role, text) => {
          const d = document.createElement("div");
          d.className = `sr-bubble ${role}`;
          d.textContent = text;
          ui.classBox.appendChild(d);
          ui.classBox.scrollTop = ui.classBox.scrollHeight;
        };
        
        const parseFile = async (file) => {
          const ext = file.name.split('.').pop().toLowerCase();
          if (['txt', 'md', 'json', 'csv'].includes(ext)) {
            return await file.text();
          } else if (ext === 'docx') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js');
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({arrayBuffer});
            return result.value;
          } else if (ext === 'pdf') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js');
            const pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            let fullText = '';
            for(let i=1; i<=Math.min(pdf.numPages, 20); i++) { // limit 20 pages
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              fullText += content.items.map(item => item.str).join(' ') + '\n';
            }
            return fullText;
          } else if (ext === 'ppt' || ext === 'pptx') {
            throw new Error("纯前端无法直接解析PPT，请将其另存为 PDF 或 TXT 后再上传哦！");
          }
          throw new Error("不支持的文件格式");
        };

        ui.fileInput.addEventListener('change', async (e) => {
          const file = e.target.files[0];
          if(!file) return;
          appendClassMsg("system", `正在解析文件：${file.name}...`);
          try {
            let text = await parseFile(file);
            if(!text || text.trim()==="") throw new Error("未能提取到文本");
            text = text.substring(0, 10000); // 截断防止 token 爆炸
            session.docText = text;
            appendClassMsg("system", `文件解析成功 (${text.length}字)。正在请 ${session.charName} 备课...`);
            
            const sysPrompt = `【当前模式】：自习室导师\n【角色设定】：你是 ${session.charName}，用你的性格和口癖辅导用户学习。\n【资料内容摘要】：\n${session.docText}\n\n【任务】：用户刚刚上传了这份学习资料。请主动用你的口吻和用户打招呼，简要概括这份资料的核心内容，并问用户想从哪里开始学起。绝对不要带前缀！`;
            
            session.messages = [{ role: "system", content: sysPrompt }];
            ui.classInput.disabled = true; ui.classSend.disabled = true;
            
            const result = await roche.ai.chat({
              messages: session.messages,
              temperature: 0.7,
              characterId: session.charId,
              conversationId: session.conversationId
            });
            
            session.messages.push({ role: "assistant", content: result.text });
            appendClassMsg("ai", result.text);
            ui.classInput.disabled = false; ui.classSend.disabled = false; ui.classInput.focus();
            
          } catch (err) {
            appendClassMsg("system", "解析失败：" + err.message);
          }
          ui.fileInput.value = "";
        });

        ui.classSend.onclick = async () => {
          const text = ui.classInput.value.trim();
          if(!text) return;
          ui.classInput.value = "";
          appendClassMsg("user", text);
          session.messages.push({ role: "user", content: text });
          ui.classInput.disabled = true; ui.classSend.disabled = true;
          try {
            const result = await roche.ai.chat({
              messages: session.messages,
              temperature: 0.7,
              characterId: session.charId,
              conversationId: session.conversationId
            });
            session.messages.push({ role: "assistant", content: result.text });
            appendClassMsg("ai", result.text);
          } catch (err) {
            appendClassMsg("system", "回复失败：" + err.message);
          } finally {
            ui.classInput.disabled = false; ui.classSend.disabled = false; ui.classInput.focus();
          }
        };

        ui.classExport.onclick = () => {
          if(session.messages.length <= 1) return roche.ui.toast("暂无笔记可导出");
          let out = `【${session.charName} 的赛博讲堂笔记】\n=========================\n\n`;
          session.messages.forEach(m => {
            if(m.role === 'user') out += `我: ${m.content}\n\n`;
            else if(m.role === 'assistant') out += `${session.charName}: ${m.content}\n\n`;
          });
          const blob = new Blob([out], { type: "text/plain;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "赛博讲堂笔记.txt";
          a.click();
          URL.revokeObjectURL(url);
        };
      },
      async unmount(container, roche) {
        container.replaceChildren();
        const s = document.getElementById("roche-plugin-study-style");
        if(s) s.remove();
      }
    }
  ]
});