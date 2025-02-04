export default function Audio() {
    return (
        <div>
            <audio id="backgroundAudio" hidden src="/assets/sounds/background.mp3" loop muted />
            <audio id="coinUpdateAudio" hidden src="/assets/sounds/coin-update.mp3" muted />
            <audio id="gameStartAudio" hidden src="/assets/sounds/game-start.mp3" muted />
            <audio id="levelUpAudio" hidden src="/assets/sounds/level-up.mp3" muted />
            <audio id="levelUpdateAudio" hidden src="/assets/sounds/level-update.mp3" muted />
            <audio id="receiveMessageAudio" hidden src="/assets/sounds/receive-message.mp3" muted />
            <audio id="sendMessageAudio" hidden src="/assets/sounds/send-message.mp3" muted />
            <audio id="pencilCheckMarkAudio" hidden src="/assets/sounds/pencil-check-mark.mp3" muted />
            <audio id="winAudio" hidden src="/assets/sounds/win.mp3" muted />
            <audio id="loseAudio" hidden src="/assets/sounds/lose.mp3" muted />
            <audio id="drawAudio" hidden src="/assets/sounds/draw.mp3" muted />
            <audio id="playAgainAudio" hidden src="/assets/sounds/play-again.mp3" muted />
            <audio id="welcomeAudio" hidden src="/assets/sounds/welcome.mp3" muted />
        </div>
    );
}
