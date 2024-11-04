<?php
/*
Plugin Name: VAPI Integration
Description: Integration des VAPI AI Assistenten
Version: 1.0
Author: Peter Kühne
*/

function enqueue_vapi_scripts() {
    wp_enqueue_script('vapi-bundle', plugins_url('dist/bundle.js', __FILE__), array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_vapi_scripts');

function enqueue_vapi_styles() {      
    wp_add_inline_style('wp-block-library', '
        .callWrapper {
            position: fixed;
            top: 100px;
            left: 0;
            right: 0;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            width: 600px;
            z-index: 9999;
        }
        .buttonSection {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        .buttonText {
            color: #858585;
            text-align: center;
            font-size: 14px;
            margin-top: 5px;
            max-width: 200px;
            line-height: 1.4;
        }
        .chatSection {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            width: 200px;
            height: 600px;
            position: relative;
        }
        #callWithVapi {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 100px;
            background: #858585;
            cursor: pointer;
            width: 100px;
            height: 100px;
        }
        #callWithVapi svg {
            width: 40px;
            fill: #fff;
        }
        #callWithVapi.connected {
            background-color: #0f8912;
        }
        #callWithVapi.disconnected {
            background-color: #858585;
        }
        #vapiTyping {
            width: 100%;
            min-height: 95px;
            max-height: 95px;
            background: #031534;
            border: none;
            border-radius: 10px;
            color: #d2d2d2;
            padding: 20px;
            flex-shrink: 0;
        }
        #chat {
            z-index: 99999;
            width: 100%;
            height: 300px;
            overflow-y: scroll;
            border: 1px solid #ccc;
            padding: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            margin: 0;
        }
        #chat .message {
            padding: 5px;
            margin-bottom: 8px;
            border-radius: 5px;
        }
        #chat .user {
            background-color: #0f8912;
            text-align: right;
            margin-left: 30px;
        }
        #chat .assistant {
            background-color: #4b9cd3;
            text-align: left;
            margin-right: 30px;
        }
        
        /* Mobile Styles */
        @media (max-width: 768px) {
            .callWrapper {
                position: relative;
                top: 0;
                left: 0;
                transform: none;
                width: 90%;
                margin: 20px auto;
                gap: 20px;
            }
            .chatSection {
                width: 100%;
            }
            #chat {
                height: 300px;
            }
            #vapiTyping {
                height: 60px;
            }
        }
    ');
}
add_action('wp_enqueue_scripts', 'enqueue_vapi_styles');

function vapi_interface_shortcode() {
    return '
    <div class="callWrapper">
        <div class="buttonSection">
            <div id="callWithVapi">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
                </svg>
            </div>
            <div class="buttonText">Klicken um den Anruf zu starten. Erneut klicken um ihn zu beenden.</div>
        </div>
        <div class="chatSection">
            <div id="vapiTyping"></div>
            <div id="vapiStatusMessage"></div>
            <div id="chat"></div>
        </div>
    </div>
    ';
}
add_shortcode('vapi_interface', 'vapi_interface_shortcode');