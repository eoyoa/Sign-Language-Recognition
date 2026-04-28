import { type NormalizedLandmark, type Category } from "@mediapipe/tasks-vision";
import { type FeatureVector } from "./feature-vector";
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
export type HandsData = {
    left?: FeatureVector;
    right?: FeatureVector;
};
export interface SignData {
    vectors: HandsData[];
}
interface BaseSign extends SignData {
    word: string | null;
}
export type Sign = BaseSign;
export interface Landmarker {
    watchWebcam(videoEl: HTMLVideoElement, canvasEl: HTMLCanvasElement, onSign: (sign: Sign) => void): Sign[];
}
export declare function createLandmarker(config: LandmarkerConfig): Promise<Landmarker>;
export {};
