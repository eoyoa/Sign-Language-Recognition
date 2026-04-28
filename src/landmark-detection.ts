import {
    DrawingUtils,
    FilesetResolver,
    HandLandmarker,
    PoseLandmarker,
    type NormalizedLandmark,
    type Category,
} from "@mediapipe/tasks-vision";
import {type FeatureVector, getFeatureVector} from "./feature-vector";
import {throwNull} from "./util";

export interface LandmarkerConfig {
    wasmPath: string;
    handTaskPath: string;
    poseTaskPath: string;
}

export interface Frame {
    handLandmarks: NormalizedLandmark[][];
    handedness: Category[][];
    poseLandmarks: NormalizedLandmark[];
}

export type HandSide = "left" | "right";
export type HandsData = { left?: FeatureVector; right?: FeatureVector };

export interface SignData {
    vectors: HandsData[]
}

interface BaseSign extends SignData {
    word: string | null
}

export type Sign = BaseSign;

export interface Landmarker {
    watchWebcam(
        videoEl: HTMLVideoElement,
        canvasEl: HTMLCanvasElement,
        onSign: (sign: Sign) => void
    ): Sign[];
}

export async function createLandmarker(config: LandmarkerConfig): Promise<Landmarker> {
    const vision = await FilesetResolver.forVisionTasks(config.wasmPath);

    const handLandmarker = await HandLandmarker.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath: config.handTaskPath,
            },
            numHands: 2,
            runningMode: "VIDEO",
        });

    const poseLandmarker = await PoseLandmarker.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath: config.poseTaskPath,
            },
            numPoses: 1,
            runningMode: "VIDEO",
        }
    );

    return {
        watchWebcam(videoEl: HTMLVideoElement, canvasEl: HTMLCanvasElement, onSign: (sign: Sign) => void): Sign[] {
            console.debug("watching webcam");
            canvasEl.style.width = `${videoEl.videoWidth} px`;
            canvasEl.style.height = `${videoEl.videoHeight} px`;
            canvasEl.width = videoEl.videoWidth;
            canvasEl.height = videoEl.videoHeight;

            const ctx = canvasEl.getContext("2d") ?? throwNull("Canvas context is null");

            let lastVideoTime = -1;
            const drawingUtils = new DrawingUtils(ctx);
            const signs: Sign[] = [];
            let currSign: Sign | null = null;

            function appendSignFrame(sign: Sign, frame: Frame) {
                sign.vectors.push(getFeatureVector(frame));
            }

            function flushSign(sign: Sign) {
                onSign(sign);
                signs.push(sign);
            }

            function renderLoop() {
                if (videoEl.currentTime !== lastVideoTime) {
                    const nowMs = performance.now();
                    const detections = handLandmarker.detectForVideo(videoEl, nowMs);
                    const poseDetections = poseLandmarker.detectForVideo(videoEl, nowMs);
                    const poseLandmarks = poseDetections.landmarks[0] ?? [];
                    lastVideoTime = videoEl.currentTime;
                    ctx.save();
                    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
                    if (poseLandmarks.length > 0) {
                        drawingUtils.drawConnectors(poseLandmarks, PoseLandmarker.POSE_CONNECTIONS, {
                            color: "#0088FF",
                            lineWidth: 2,
                        });
                        drawingUtils.drawLandmarks(poseLandmarks, {color: "#0044FF", lineWidth: 1});
                    }
                    if (detections.landmarks.length > 0) {
                        if (currSign === null) {
                            console.log("starting new sign");
                            currSign = {vectors: [], word: null};
                        }
                        appendSignFrame(currSign, {
                            handLandmarks: detections.landmarks,
                            handedness: detections.handedness,
                            poseLandmarks,
                        });
                        for (const landmarks of detections.landmarks) {
                            drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
                                color: "#00FF00",
                                lineWidth: 5
                            });
                            drawingUtils.drawLandmarks(landmarks, {color: "#FF0000", lineWidth: 2});
                        }
                    } else if (currSign) {
                        console.log("no hands detected, flushing sign", currSign);
                        flushSign(currSign);
                        currSign = null;
                        console.log("flushed sign, signs:", structuredClone(signs));
                    }
                    ctx.restore();
                }

                requestAnimationFrame(() => {
                    renderLoop();
                });
            }

            renderLoop();
            return signs;
        }
    };
}
