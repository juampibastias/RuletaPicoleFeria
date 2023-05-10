import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';

// Internals
import spinSound from './assets/soundspin3.mp3';

const WheelComponent = ({
    segments,
    segColors,
    winningSegment,
    onFinished,
    primaryColor,
    contrastColor,
    buttonText,
    isOnlyOnce,
}) => {
    let currentSegment = '';
    let isStarted = false;
    const [isFinished, setFinished] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    let timerHandle = 0;
    const timerDelay = segments.length;
    let angleCurrent = 0;
    let angleDelta = 0;
    const size = 500;
    let canvasContext = null;
    let maxSpeed = Math.PI / `${segments.length}`;
    const upTime = segments.length * 100;
    const downTime = segments.length * 1000;
    let spinStart = 0;
    let frames = 0;
    const centerX = 550;
    const centerY = 550;

    const [play, { stop }] = useSound(spinSound);
    const sound = new Audio(spinSound);

    const Popup = () => (
        <div
            style={{
                position: 'fixed',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 'auto',
                backgroundColor: 'rgba(0,0,0, 0.5)',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%,-50%)',
                    backgroundColor: '#fff',
                    padding: '10px',
                    borderRadius: '10px',
                    width: '300px',
                    height: '200px',
                }}
            >
                <h1>CONGRATULATIONS!!!</h1>
                <p>YOU HAVE WON {currentSegment} !!!</p>
                <button onClick={() => setShowPopup(false)}>OK</button>
            </div>
        </div>
    );

    useEffect(() => {
        wheelInit();
        setTimeout(() => {
            window.scrollTo(0, 1);
        }, 0);
    }, []);
    const wheelInit = () => {
        initCanvas();
        wheelDraw();
    };

    const initCanvas = () => {
        let canvas = document.getElementById('canvas');
        if (navigator.appVersion.indexOf('MSIE') !== -1) {
            canvas = document.createElement('canvas');
            canvas.setAttribute('width', 1000);
            canvas.setAttribute('height', 600);
            canvas.setAttribute('id', 'canvas');
            document.getElementById('wheel').appendChild(canvas);
        }
        canvas.addEventListener('click', spin, false);
        canvasContext = canvas.getContext('2d');
    };
    const spin = async () => {
        isStarted = true;
        try {
            if (sound.readyState === 4) {
                sound.play();
            } else {
                sound.addEventListener(
                    'canplaythrough',
                    () => {
                        sound.play();
                    },
                    false
                );
            }
        } catch (error) {
            console.error('Failed to play the sound:', error);
        }
        if (timerHandle === 0) {
            spinStart = new Date().getTime();
            maxSpeed = Math.PI / segments.length;
            frames = 0;
            timerHandle = setInterval(onTimerTick, timerDelay);
        }
    };

    const onTimerTick = () => {
        frames++;
        draw();
        const duration = new Date().getTime() - spinStart;
        let progress = 0;
        let finished = false;
        if (duration < upTime) {
            progress = duration / upTime;
            angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
        } else {
            if (winningSegment) {
                if (
                    currentSegment === winningSegment &&
                    frames > segments.length
                ) {
                    progress = duration / upTime;
                    angleDelta =
                        maxSpeed *
                        Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
                    progress = 1;
                } else {
                    progress = duration / downTime;
                    angleDelta =
                        maxSpeed *
                        Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
                }
            } else {
                progress = duration / downTime;
                angleDelta =
                    maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
            }
            if (progress >= 1) finished = true;
        }

        angleCurrent += angleDelta;
        while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
        if (finished) {
            setFinished(true);
            onFinished(currentSegment);
            clearInterval(timerHandle);
            timerHandle = 0;
            angleDelta = 0;

            stop();
        }
    };

    const wheelDraw = () => {
        clear();
        drawWheel();
        drawNeedle();
    };

    const draw = () => {
        clear();
        drawWheel();
        drawNeedle();
    };

    const drawSegment = (key, lastAngle, angle) => {
        const ctx = canvasContext;
        const value = segments[key];
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, size, lastAngle, angle, false);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fillStyle = segColors[key];
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((lastAngle + angle) / 2);
        ctx.fillStyle = contrastColor || 'white';
        ctx.font = 'bold 2em proxima-nova';
        ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
        ctx.restore();
    };

    const drawWheel = () => {
        const ctx = canvasContext;
        let lastAngle = angleCurrent;
        const len = segments.length;
        const PI2 = Math.PI * 2;
        ctx.lineWidth = 1;
        ctx.strokeStyle = primaryColor || 'black';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = '2em proxima-nova';
        for (let i = 1; i <= len; i++) {
            const angle = PI2 * (i / len) + angleCurrent;
            drawSegment(i - 1, lastAngle, angle);
            lastAngle = angle;
        }

        // Draw a center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, PI2, false);
        ctx.closePath();
        ctx.fillStyle = primaryColor || 'black';
        ctx.lineWidth = 10;
        ctx.strokeStyle = contrastColor || 'white';
        ctx.fill();
        ctx.font = 'bold 3em proxima-nova';
        ctx.fillStyle = contrastColor || 'white';
        ctx.textAlign = 'center';
        ctx.fillText(buttonText || 'Spin', centerX, centerY + 3);
        ctx.stroke();

        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, PI2, false);
        ctx.closePath();

        ctx.lineWidth = 10;
        ctx.strokeStyle = primaryColor || 'black';
        ctx.stroke();
    };

    const drawNeedle = () => {
        const ctx = canvasContext;
        ctx.lineWidth = 1;
        ctx.strokeStyle = contrastColor || 'white';
        ctx.fileStyle = contrastColor || 'white';
        ctx.beginPath();
        ctx.moveTo(centerX + 20, centerY - 50);
        ctx.lineTo(centerX - 20, centerY - 50);
        ctx.lineTo(centerX, centerY - 70);
        ctx.closePath();
        ctx.fill();
        const change = angleCurrent + Math.PI / 2;
        let i =
            segments.length -
            Math.floor((change / (Math.PI * 2)) * segments.length) -
            1;
        if (i < 0) i = i + segments.length;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = primaryColor || 'black';
        ctx.font = 'bold 2.5em proxima-nova';
        currentSegment = segments[i];
        isFinished &&
            ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
    };
    const clear = () => {
        const ctx = canvasContext;
        ctx.clearRect(0, 0, 1000, 500);
    };
    return (
        <>
            <canvas
                id='canvas'
                width='1100'
                height='1100'
                style={{
                    pointerEvents: isFinished && !isOnlyOnce ? 'none' : 'auto',
                }}
            />
            {showPopup && <Popup />}
        </>
    );
};
export default WheelComponent;
