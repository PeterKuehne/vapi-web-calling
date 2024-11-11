import Vapi from "@vapi-ai/web";

// Sicherstellen, dass der Code erst nach dem DOM-Load ausgeführt wird
document.addEventListener('DOMContentLoaded', function() {
    const statusDisplay = document.getElementById("status");
    const speakerDisplay = document.getElementById("speaker");
    const volumeDisplay = document.getElementById("volume");
    const vapiTyping = document.getElementById("vapiTyping");
    const vapiStatusMessage = document.getElementById("vapiStatusMessage");
    const chatWindow = document.getElementById("chat");

    const vapi = new Vapi("e18d639c-56d3-4c0f-a2f5-5a42a29e0ccd");

    let connected = false;
    let assistantIsSpeaking = false;
    let volumeLevel = 0;
    let callActive = false;
    const maxSpread = 30; // Maximum spread of the shadow in pixels

    // Vapi Event Listeners
    vapi.on("call-start", function () {
        connected = true;
        updateUI();
    });

    vapi.on("call-end", function () {
        connected = false;
        updateUI();

        callWithVapi.style.boxShadow = `0 0 0px 0px rgba(58,25,250,0.7)`;
    });

    vapi.on("speech-start", function () {
        assistantIsSpeaking = true;
        updateUI();
    });

    vapi.on("speech-end", function () {
        assistantIsSpeaking = false;
        updateUI();
    });

    vapi.on("message", (message) => {
        if (message.type === "function-call") {
            // If the ChangeColor function was calles
            if (message.functionCall && message.functionCall.name === "ChangeColor") {
                // Don't forget to sanitzie the values when building this in a real application
                callWithVapi.style.backgroundColor =
                    message.functionCall.parameters.ColorCode;
            }

            // If the ChangeColor function was calles
            if (message.functionCall && message.functionCall.name === "WriteText") {
                // Don't forget to sanitzie the values when building this in a real application
                vapiTyping.textContent = message.functionCall.parameters.Text;
            }
        }

        // Adds a message to the background chat
        if (message.type === "conversation-update") {
            updateChat(message);
        }
    });

    // Modifiziere den volume-level Event Listener
    vapi.on("volume-level", function (level) {
        try {
            const callWithVapi = document.getElementById("callWithVapi");
            if (!callWithVapi) return;
    
            const spread = Math.floor(level * 30);
            
            if (spread >= 0) {
                callWithVapi.style.boxShadow = `0 0 ${spread}px ${Math.floor(spread/2)}px rgba(4,56,244,0.7)`;
            }
        } catch (error) {
            console.error("Error in volume-level handler:", error);
        }
    });

    vapi.on("call-start", function () {
    connected = true;
    updateUI();
    });


    vapi.on("call-end", function () {
        connected = false;
        updateUI();
        
    const callWithVapi = document.getElementById("callWithVapi");
    if (callWithVapi) {
        callWithVapi.style.boxShadow = 'none'; // Komplett ohne Schatten
        // ODER mit grauem Schatten:
        // callWithVapi.style.boxShadow = '0 0 0px 0px #858585';
        }
    });

    callWithVapi.addEventListener("click", function () {
        if (!callActive) {
            callActive = true;
            callWithVapi.style.backgroundColor = "#007aff";
            vapi.start(assistantOptions);
        } else {
            callActive = false;
            callWithVapi.style.backgroundColor = "#858585";
            vapi.stop();
        }
    });

    // Initialize background with the correct color
    callWithVapi.style.backgroundColor = "#858585";

    function updateChat(conversationUpdate) {
        chatWindow.innerHTML = ""; // Clear the chat window before adding new messages

        conversationUpdate.conversation.forEach((message) => {
            var messageDiv = document.createElement("div");
            messageDiv.classList.add("message");

            // Add specific class based on the role
            switch (message.role) {
                case "assistant":
                    messageDiv.classList.add("assistant");
                    break;
                case "user":
                    messageDiv.classList.add("user");
                    break;
                case "tool": // You might want a different style for tool responses
                    messageDiv.classList.add("tool");
                    break;
            }

            // Set text content and handle tool calls if they exist
            if (message.content) {
                messageDiv.textContent = message.content;
            } else if (message.tool_calls && message.tool_calls.length > 0) {
                // Example: Append a generic message or handle differently
                messageDiv.textContent = "Processing request...";
            }

            chatWindow.appendChild(messageDiv);
        });

        // Scroll to the bottom of the chat window
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function updateUI() {
        const callWithVapi = document.getElementById("callWithVapi");
        if (callWithVapi) {
            // Statt Text zu ändern, nutzen wir CSS-Klassen
            if (connected) {
                callWithVapi.classList.add("connected");
                callWithVapi.classList.remove("disconnected");
            } else {
                callWithVapi.classList.remove("connected");
                callWithVapi.classList.add("disconnected");
            }
        }
    }

    const assistantOptions = {
        "name": "_skOnlineMarketing",
        "voice": {
            "model": "eleven_multilingual_v2",
            "voiceId": "1Rh9mi9LSTTPXBR36myT",
            "provider": "11labs",
            "stability": 0.5,
            "similarityBoost": 0.75,
            "fillerInjectionEnabled": false
        },
        "model": {
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "system",
                    "content": "\n**Identity**\n\nDu bist der Voice Assistent von SK Online Marketing und agierst als erfahrener Marketingberater, der Kundenfragen zu den Produkten und Dienstleistungen des Unternehmens beantwortet. Dein Wissen umfasst die Bereiche Webdesign, digitales Marketing, Content Management, Fotografie und Film, sowie KI-basierte Chatbots und Voice-Assistenten. Dein Ziel ist es, den Nutzern das Angebot von SK Online Marketing verständlich zu machen und ihnen bei der Auswahl passender Marketinglösungen zu helfen – stets in Echtzeit und mit hoher Effizienz.\n\n**Style**\n\n-   Freundlich und zugänglich.\n-   Informationen klar und präzise, ohne unnötige Ausschweifungen.\n-   Antworten sind kurz und direkt.\n\n**Response Guidelines**\n\n-   Verwende kurze, klare Sätze und vermeide Aufzählungen oder nummerierte Listen.\n-   Vermeide ausschweifende Erklärungen – antworte konkret und präzise auf die jeweilige Frage.\n-   Falls der Nutzer nach einem Termin fragt, antworte direkt mit den benötigten Informationen zur \n     Terminvereinbarung.\n-   Falls der Nutzer am Ende einer Informationseinheit noch Fragen hat, biete an, weitere Details zu geben.\n\n**Task & Goals**\n\n1.  **Produkt- und Dienstleistungsinformationen bereitstellen:** Beantworte spezifische Fragen zu den verschiedenen Servicebereichen von SK Online Marketing (Webdesign, digitales Marketing, Content Management, Fotografie & Film, sowie KI-Lösungen) präzise und verständlich.\n    \n\n**2. Terminbuchung nur bei Bedarf an detaillierter Beratung anbieten:**\n\n-   **Anweisungen für den Assistenten**:\n    \n    -   **Beantworte allgemeine Fragen direkt**, ohne einen Termin anzubieten. Dazu zählen Fragen wie:\n        -   „Was kostet das?“\n        -   „Wie lange dauert das?“\n        -   „Wie funktioniert das?“\n    -   Bei solchen allgemeinen Fragen gib **eine kurze, informative Antwort** oder eine ungefähre Preisschätzung, wenn möglich. **Biete keinen Termin an**.\n-   **Wann einen Termin anbieten:** Nur dann, wenn der Kunde explizit um eine **detaillierte Beratung** oder eine **Projektbesprechung** bittet, z. B. wenn er:\n    \n    -   nach einer maßgeschneiderten Lösung fragt,\n    -   spezifische Projektanforderungen anspricht,\n    -   eine umfassendere Beratung oder Planung wünscht.\n-   **Beispiele für Situationen, in denen KEIN Termin angeboten wird:**\n    \n    -   „Ich benötige eine Webseite, was kostet das?“ → **Antwort**: „Die Kosten hängen vom Umfang der Webseite ab. Ich kann Ihnen eine ungefähre Preisspanne nennen oder Ihnen Beispiele ähnlicher Projekte geben.“\n    -   „Wie lange dauert die Umsetzung?“ → **Antwort**: „Die Dauer ist abhängig von den Anforderungen, typischerweise dauert eine einfache Webseite etwa X Wochen.“\n-   **Beispiele für Situationen, in denen ein Termin angeboten wird:**\n    \n    -   „Ich möchte eine Webseite mit spezifischen Funktionen. Können wir uns dazu beraten?“ → **Termin anbieten**: „Gerne können Sie einen Termin mit Stefan Kühne vereinbaren, um Ihre Anforderungen im Detail zu besprechen.“\n    -   „Wir planen ein komplexes Projekt und benötigen eine individuelle Beratung.“ → **Termin anbieten**: „Für ein detailliertes Gespräch zu Ihren Anforderungen können Sie gerne einen Termin mit Stefan Kühne vereinbaren.“\n    \n3.  **Fragen vollständig klären:** Stelle sicher, dass alle Kundenfragen beantwortet sind, bevor du die Möglichkeit zur Terminbuchung anbietest.\n    \n\n**Beispielanfragen und Antworten**\n    \n-   **Kunde:** \"Wie kann ich meine Website für SEO optimieren?\"  \n    **Antwort:** \"Wir bieten umfassende SEO-Optimierungsservices an, die Ihre Website besser auffindbar machen. Haben Sie Interesse an einem Termin mit Stefan Kühne, um Ihre SEO-Strategie zu besprechen?\"\n    \n-   **Kunde:** \"Bietet ihr professionelle Fotoshootings für E-Commerce-Produkte an?\"  \n    **Antwort:** \"Ja, wir bieten professionelle Produktfotografie für E-Commerce an. Möchten Sie einen Termin vereinbaren, um mehr darüber zu erfahren?\"\n    \n\n**Anweisungen für die Nutzung**\n\n-   Ermutige den Kunden dazu, gezielte Fragen zu stellen, damit du spezifisch und hilfreich antworten kannst.\n-   Halte die Antworten kurz und vermeide Details, die nicht explizit angefragt werden.\n-   Biete an, weitere Informationen zu geben, wenn der Kunde das wünscht, und leite bei Bedarf an menschliche Berater weiter.\n-   Wenn eine Terminbuchung gewünscht ist, antworte mit: \"Um einen Termin mit Stefan Kühne zu buchen, benötige ich bitte Ihren Vor- und Nachnamen sowie den gewünschten Tag und die genaue Uhrzeit.\""
                }
            ],
            "provider": "openai",
            "maxTokens": 350,
            "temperature": 0.6,
            "knowledgeBase": {
                "topK": 2,
                "fileIds": [
                    "acf98a56-4627-4167-bb00-31c5d5c190ca"
                ],
                "provider": "canonical"
            }
        },
        "firstMessage": "Willkommen bei SK Online Marketing. Ich bin Ihr digitaler Assistent – wie kann ich Ihnen helfen?",
        "transcriber": {
            "model": "nova-2",
            "language": "de",
            "provider": "deepgram"
        },
        "clientMessages": [
            "transcript",
            "hang",
            "function-call",
            "speech-update",
            "metadata",
            "transfer-update",
            "conversation-update"
        ],
        "serverMessages": [
            "end-of-call-report",
            "status-update",
            "hang",
            "function-call"
        ],
        "backchannelingEnabled": false,
        "backgroundDenoisingEnabled": false
    }
});