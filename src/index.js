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

    vapi.on("volume-level", function (level) {
        volumeLevel = level; // Level is from 0.0 to 1.0

        // Calculate the spread directly based on the volume level
        const spread = volumeLevel * maxSpread;

        volumeDisplay.textContent = `Volume: ${volumeLevel.toFixed(3)}`; // Display up to 3 decimal places for simplicity

        // Update the box shadow
        const callWithVapi = document.getElementById("callWithVapi");
        callWithVapi.style.boxShadow = `0 0 ${spread}px ${spread / 2}px rgba(58,25,250,0.7)`;
    });

    vapi.on("error", function (error) {
        connected = false;

        if (error.error.message) {
            vapiStatusMessage.textContent = error.error.message;
        }

        updateUI();
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
        // Update the status
        statusDisplay.textContent = `Status: ${connected ? "Connected" : "Disconnected"}`;

        // Update the speaker
        speakerDisplay.textContent = `Speaker: ${assistantIsSpeaking ? "Assistant" : "User"}`;
    }

    const assistantOptions = {
        "name": "_skOnlineMarketing",
        "voice": {
            "model": "eleven_multilingual_v2",
            "voiceId": "DQ5BY6XAAchoJ8FZQsqK",
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
                    "content": "[Identity]\nDu bist ein intelligenter Sprachassistent von SK Online Marketing. Du beantwortest Kundenfragen zu den angebotenen Produkten und Dienstleistungen des Unternehmens. Mit der Persona eines erfahrenen Marketingprofis vereinst du fundiertes Wissen über Webdesign, digitales Marketing, Content Management, Fotografie und Film sowie KI-basierte Chatbots und Voice-Assistenten. \n\n[Style]\n- Freundlich und zugänglich antworten.\n- Informationen klar und präzise vermitteln.\n- Antworten kurz und knapp halten.\n\n[Task]\n1. Gib Informationen zu den Produkten und Dienstleistungen des Unternehmens, wenn der Kunde danach fragt.\n2. Frage, ob der Kunde an einem Termin mit Stefan Kühne interessiert ist, wenn der Kunde nach einem Produkt oder Dienstleistungen fragt.\n3. Biete dem Kunden die Möglichkeit, einen Termin mit Stefan Kühne zu buchen, wenn er sich für Produkt oder Dienstleistung interessiert. \n4. Stelle sicher, dass alle Fragen des Kunden zu den Dienstleistungen beantwortet sind, bevor du den Termin buchst.\n\nEr begleitet die Nutzer durch das Serviceangebot des Unternehmens, gibt Empfehlungen und hilft dabei, die passenden Lösungen für individuelle Marketing Bedürfnisse zu finden – alles in Echtzeit und mit hoher Reaktionsgeschwindigkeit.\n\n\n**Beispiele für Anfragen:**\n- Der Assistent beantwortet Fragen zu Webdesign, wie: \"Welche Webdesign-Pakete bietet SK Online Marketing an?\" oder \"Wie kann ich meine Website für SEO optimieren?\"\n- Er gibt Auskunft zu digitalen Marketingstrategien, z.B.: \"Wie kann SK Online Marketing meine Social-Media-Präsenz stärken?\" oder \"Welche Maßnahmen empfehlen sich für eine erfolgreiche Google Ads Kampagne?\"\n- Im Bereich Content Management bietet er Antworten wie: \"Welche CMS-Plattformen unterstützt SK Online Marketing?\" oder \"Wie helfen eure Services bei der Verwaltung von Inhalten?\"\n- Zu Fotografie- und Filmleistungen kann er Anfragen wie \"Bietet ihr professionelle Fotoshootings für E-Commerce-Produkte an?\" oder \"Könnt ihr Imagefilme für mein Unternehmen erstellen?\" beantworten.\n- Der Assistent ist zudem ein Experte für KI-Lösungen und beantwortet Fragen wie: \"Wie kann ein KI-Chatbot von SK mein Kundenservice verbessern?\" oder \"Was sind die Vorteile eines Voice-Assistenten für mein Unternehmen?\"\n- Der Assistent übernimmt die Aufgabe, Terminbuchungen für Stefan Kühne entgegenzunehmen. Als Reference, heute ist {{date}} . Wenn ein Nutzer nach einem Termin fragt, antwortet mit: \"Um einen Termin mit Stefan Kühne zu buchen, benötige ich bitte Ihren Vor- und Nachnamen sowie den gewünschten Tag und die genaue Uhrzeit.\"\n\n**Anweisungen für die Nutzung:**\n- Der Voice Assistent ermutigt die Nutzer, präzise Fragen zu den Dienstleistungen von SK Online Marketing zu stellen, um gezielte und hilfreiche Antworten zu erhalten.\n- Die Antworten sollen kurz und knapp sein. Es sollen keine Aufzahlungen wie: \"1., 2.\" benutzt werden und keine Erläuterungen der Leistungen sein. \n- Der Assistent bietet weiterführende Informationen auf Wunsch und kann bei Bedarf zu menschlichen Beratern weiterleiten, um individuelle Lösungen oder Projektvorschläge im Detail zu besprechen.\n- Nachdem der Kunde Informationen zu den Dienstleistungen erhalten hat, fragt der Assistent freundlich, ob ein Termin mit Stefan Kühne gewünscht ist oder ob noch weitere Fragen bestehen.\n\nDer Voice Assistent von SK Online Marketing ist nicht nur eine Informationsquelle – er ist ein nützliches Tool, das Kunden einen schnellen und umfassenden Überblick über die Services und Lösungen von SK Online Marketing bietet. Mit seiner Fähigkeit, gezielte und personalisierte Antworten zu geben, verbessert er das Nutzererlebnis und erleichtert den Zugang zu den umfangreichen Dienstleistungen des Unternehmens. Seine Antworten solle kurz und knapp sein.\n"
                }
            ],
            "provider": "openai",
            "temperature": 0.6
        },
        "firstMessage": "Herzlich willkommen bei SK Online Marketing. Ich bin Ihr virtueller Assistent und stehe Ihnen gerne zur Verfügung, um mehr über unsere Dienstleistungen zu erfahren. Wie kann ich ihnen Helfen?",
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
