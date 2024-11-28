import useCountdownProgress from "../../hooks/useCountdownProgress";

export function  getClassicCountdownTimer(timeLeft, countdownTimer) 
{
    let countdownTimerHtml;
    countdownTimerHtml = `<div>
        <span style="color:${countdownTimer.display_setting?.digitsColor}">
            ${timeLeft.days}days ${timeLeft.hours}:${timeLeft.minutes}:<span id="seconds">${timeLeft.seconds}</span>
        </span>
    </div>`
    return countdownTimerHtml;
}
export const getHexagonCountdownTimer = (timeLeft, countdownTimer) =>
{
    let countdownTimerHtml;
    countdownTimerHtml = `<div className="HexagonCountdown" style={{ color: digitsColor }}>
        <div className="HexagonCountdown-item">
        
        <span className="HexagonCountdown-number"> ${timeLeft.days}</span>
        <span className="hexaValue">days</span>
        </div>

        <div className="HexagonCountdown-item">
        <span className="HexagonCountdown-number">${timeLeft.hours}</span>
        <span className="hexaValue">hours</span>
        </div>

        <div className="HexagonCountdown-item">
        <span className="HexagonCountdown-number">${timeLeft.minutes}</span>
        <span className="hexaValue">minutes</span>
        </div>

        <div className="HexagonCountdown-item">
        <span className="HexagonCountdown-number">${timeLeft.seconds}</span>
        <span className="hexaValue">seconds</span>
        </div>
    </div>`
    return countdownTimerHtml
}
export const getProgressCircleCountdownTimer = (timeLeft, countdownTimer) =>
{
    let countdownTimerHtml;
    let days = timeLeft.days;
    let hours = timeLeft.hours;
    let minutes = timeLeft.minutes
    let seconds = timeLeft.seconds;
    const { daysProgress, hoursProgress, minutesProgress, secondsProgress } = useCountdownProgress(countDownStartAt, countDownEndsAt, {
      days,
      hours,
      minutes,
      seconds,
    });
    countdownTimerHtml += `
        <div class="ProgressCircleCountdown" style="color:${countdownTimer.display_setting?.digitsColor}">
            <div class="ProgressCircleCountdown-item">
                <svg width="80" height="80" viewBox="0 0 80 80" class="circular-progress-bar">
                    <circle stroke="#000000" fill="transparent" stroke-width="1" r="35" cx="40" cy="40"></circle>
                    <circle 
                        stroke="#000000" 
                        fill="transparent" 
                        stroke-width="4" 
                        stroke-linecap="round" 
                        r="35" 
                        cx="40" 
                        cy="40" 
                        style="stroke-dasharray: 219.911; stroke-dashoffset: ${getStrokeDashOffset(24 * 3600, days * 24 * 3600)}; transition: stroke-dashoffset 0.35s; transform: rotate(-90deg); transform-origin: 50% 50%;">
                    </circle>
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20px" fill="#000000">${days}</text>
                </svg>
                <div class="circle-progress-wrapper">
                    <span class="ProgressCircleCountdown-number">${days}</span>
                    <span>days</span>
                </div>
            </div>

            <span class="ProgressCircleCountdown-divider">:</span>

            <div class="ProgressCircleCountdown-item">
                <svg width="80" height="80" viewBox="0 0 80 80" class="circular-progress-bar">
                    <circle stroke="#000000" fill="transparent" stroke-width="1" r="35" cx="40" cy="40"></circle>
                    <circle 
                        stroke="#000000" 
                        fill="transparent" 
                        stroke-width="4" 
                        stroke-linecap="round" 
                        r="35" 
                        cx="40" 
                        cy="40" 
                        style="stroke-dasharray: 219.911; stroke-dashoffset: ${getStrokeDashOffset(3600, hours * 3600)}; transition: stroke-dashoffset 0.35s; transform: rotate(-90deg); transform-origin: 50% 50%;">
                    </circle>
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20px" fill="#000000">${hours}</text>
                </svg>
                <div class="circle-progress-wrapper">
                    <span class="ProgressCircleCountdown-number">${hours}</span>
                    <span>hours</span>
                </div>
            </div>

            <span class="ProgressCircleCountdown-divider">:</span>

            <!-- Minutes -->
            <div class="ProgressCircleCountdown-item">
                <svg width="80" height="80" viewBox="0 0 80 80" class="circular-progress-bar">
                    <circle stroke="#000000" fill="transparent" stroke-width="1" r="35" cx="40" cy="40"></circle>
                    <circle 
                        stroke="#000000" 
                        fill="transparent" 
                        stroke-width="4" 
                        stroke-linecap="round" 
                        r="35" 
                        cx="40" 
                        cy="40" 
                        style="stroke-dasharray: 219.911; stroke-dashoffset: ${getStrokeDashOffset(60, minutes * 60)}; transition: stroke-dashoffset 0.35s; transform: rotate(-90deg); transform-origin: 50% 50%;">
                    </circle>
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20px" fill="#000000">${minutes}</text>
                </svg>
                <div class="circle-progress-wrapper">
                    <span class="ProgressCircleCountdown-number">${minutes}</span>
                    <span>minutes</span>
                </div>
            </div>

            <span class="ProgressCircleCountdown-divider">:</span>

            <!-- Seconds -->
            <div class="ProgressCircleCountdown-item">
                <svg width="80" height="80" viewBox="0 0 80 80" class="circular-progress-bar">
                    <circle stroke="#000000" fill="transparent" stroke-width="1" r="35" cx="40" cy="40"></circle>
                    <circle 
                        stroke="#000000" 
                        fill="transparent" 
                        stroke-width="4" 
                        stroke-linecap="round" 
                        r="35" 
                        cx="40" 
                        cy="40" 
                        style="stroke-dasharray: 219.911; stroke-dashoffset: ${getStrokeDashOffset(60, seconds)}; transition: stroke-dashoffset 0.35s; transform: rotate(-90deg); transform-origin: 50% 50%;">
                    </circle>
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20px" fill="#000000">${seconds}</text>
                </svg>
                <div class="circle-progress-wrapper">
                    <span class="ProgressCircleCountdown-number">${seconds}</span>
                    <span>seconds</span>
                </div>
            </div>
        </div>
    `;
    return countdownTimerHtml;
}
export const getCardCountdownTimer = (timeLeft, countdownTimer) =>
{
    let countdownTimerHtml;
    countdownTimerHtml += `<div className="CardCountdown" style="color: ${countdownTimer.display_setting.digitsColor }>
      <div className="CardCountdown-item">
        <span className="CardCountdown-number">${timeLeft.days}</span>
        <span className="cardCountdown-title">days</span>
      </div>
      <span className="CardCountdown-divider">:</span>
      <div className="CardCountdown-item">
        <span className="CardCountdown-number">${timeLeft.hours}</span>
        <span className="cardCountdown-title">hours</span>
      </div>
      <span className="CardCountdown-divider">:</span>
      <div className="CardCountdown-item">
        <span className="CardCountdown-number">${timeLeft.minutes}</span>
        <span className="cardCountdown-title">minutes</span>
      </div>
      <span className="CardCountdown-divider">:</span>
      <div className="CardCountdown-item">
        <span className="CardCountdown-number">${timeLeft.seconds}</span>
        <span className="cardCountdown-title">seconds</span>
      </div>
    </div>`
    return countdownTimerHtml;
}
export const getModernCountdownTimer = (timeLeft, countdownTimer) =>
{
    let countdownTimerHtml;
    countdownTimerHtml += `<div className="ModernsCountdown" style="color: ${countdownTimer.display_setting.digitsColor };">
      <div className="ModernsCountdown-item">
        <span className="ModernsCountdown-number">${timeLeft.days}</span>
      
      </div>
      <span className="ModernsCountdown-divider">:</span>
      <div className="ModernsCountdown-item">
        <span className="ModernsCountdown-number">${timeLeft.hours}</span>
        
      </div>
      <span className="ModernsCountdown-divider">:</span>
      <div className="ModernsCountdown-item">
        <span className="ModernsCountdown-number">${timeLeft.minutes}</span>
    
      </div>
      <span className="ModernsCountdown-divider">:</span>
      <div className="ModernsCountdown-item">
        <span className="ModernsCountdown-number">${timeLeft.seconds}</span>
       
      </div>
    </div>`
  return countdownTimerHtml;
}
export const  getProgressBarCountdownTimer = (timeLeft, countdownTimer) =>
{
    let countdownTimerHtml;
    countdownTimerHtml += `<div className="ProgressBarCountdown" style="color: ${countdownTimer.display_setting.digitsColor };">
        <div className="ProgressBarCountdown-item">
          <span className="ProgressBarCountdown-number">${timeLeft.days} <span className="innerTitle">days</span></span>
        </div>
        <span className="ProgressBarCountdown-divider">:</span>
        <div className="ProgressBarCountdown-item">
          <span className="ProgressBarCountdown-number">${timeLeft.hours}</span>
        </div>
        <span className="ProgressBarCountdown-divider">:</span>
        <div className="ProgressBarCountdown-item">
          <span className="ProgressBarCountdown-number" id="minutes">${timeLeft.minutes}</span>
        </div>
        <span className="ProgressBarCountdown-divider">:</span>
        <div className="ProgressBarCountdown-item">
          <span className="ProgressBarCountdown-number" id="seconds">${timeLeft.seconds}</span>
        </div>
      </div>`
    return countdownTimerHtml
}
export const getDividerCountdownTimer = (timeLeft, countdownTimer) =>
{
    let countdownTimerHtml;
    countdownTimerHtml += `<div className="countdown" style="color: ${countdownTimer.display_setting.digitsColor };">
      <div className="countdown-item">
        <span className="countdown-number" id="days">${timeLeft.days}</span>
        <span className="countdown-label">days</span>
      </div>
      ${divider()}
      <div className="countdown-item">
        <span className="countdown-number" id="hours">${timeLeft.hours}</span>
        <span className="countdown-label">hours</span>
      </div>
      ${divider()}
      <div className="countdown-item">
        <span className="countdown-number" id="minutes">${timeLeft.minutes}</span>
        <span className="countdown-label">minutes</span>
      </div>
      ${divider()}
      <div className="countdown-item">
        <span className="countdown-number" id="seconds">${timeLeft.seconds}</span>
        <span className="countdown-label">seconds</span>
      </div>
    </div>`
    return countdownTimerHtml;
}
function divider()
{
    return `<span className="divider" style={{ color: borderColor }}>
        /
      </span>`;
}