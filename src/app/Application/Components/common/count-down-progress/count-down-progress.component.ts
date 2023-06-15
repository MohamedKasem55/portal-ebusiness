import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges, OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';

@Component({
    selector: 'arb-count-down-progress',
    templateUrl: './count-down-progress.component.html',
    styleUrls: ['./count-down-progress.component.scss']
})
export class CountDownProgressComponent implements OnInit, AfterViewInit,OnChanges,OnDestroy{


    FULL_DASH_ARRAY = 283;
    RESET_DASH_ARRAY;

    @ViewChild('baseTimerPathRemaining') timer: ElementRef;
    @ViewChild('baseTimerLabel') timeLabel: ElementRef;

    @Input()
    TIME_LIMIT ; //in seconds

    @Output()
    onTimeUp: EventEmitter<boolean> = new EventEmitter<boolean>();

    timePassed = -1;

    timeLeft = this.TIME_LIMIT;

    timerInterval = null;

    constructor() {
        this.RESET_DASH_ARRAY == `-57 ${this.FULL_DASH_ARRAY}`;
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.timeLabel.nativeElement.addEventListener("load", () => {
            this.timeLabel.nativeElement.innerHTML = this.formatTime(this.TIME_LIMIT);
        });
    }

    reset() {
        clearInterval(this.timerInterval);
        this.resetVars();
        this.timer.nativeElement.setAttribute("stroke-dasharray", this.RESET_DASH_ARRAY);
    }

    start(withReset = false) {
        if (withReset) {
            this.resetVars();
        }
        this.startTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timePassed = this.timePassed += 1;
            this.timeLeft = this.TIME_LIMIT - this.timePassed;
            this.timeLabel.nativeElement.innerHTML = this.formatTime(this.timeLeft);
            this.setCircleDasharray();
            if (this.timeLeft === 0) {
                this.timeIsUp();
            }
        }, 1000);
    }

    timeIsUp() {
        clearInterval(this.timerInterval);
        this.onTimeUp.emit(true);
    }

    resetVars() {
        this.timePassed = -1;
        this.timeLeft = this.TIME_LIMIT;
        this.timeLabel.nativeElement.innerHTML = this.formatTime(this.TIME_LIMIT);
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        let secondsToShow = "" + seconds;
        if (seconds < 10) {
            secondsToShow = `0${seconds}`;
        }
        return `${minutes}:${secondsToShow}`;
    }

    calculateTimeFraction() {
        const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
        return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - rawTimeFraction);
    }

    setCircleDasharray() {
        const circleDasharray = `${(
            this.calculateTimeFraction() * this.FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        this.timer.nativeElement.setAttribute("stroke-dasharray", circleDasharray);
    }

    ngOnChanges(): void {
        this.start();
    }
    ngOnDestroy(): void {
        clearInterval(this.timerInterval);
    }
}