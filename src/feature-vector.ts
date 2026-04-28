import {HandLandmarker, type NormalizedLandmark} from "@mediapipe/tasks-vision";
import type {Frame, HandsData} from "./landmark-detection";
import {array, array_equal, dot, linalg, NDArrayCore} from "numpy-ts/core";

function landmarksToConnectionVector(singleHandLandmarks: NormalizedLandmark[]) {
    return HandLandmarker.HAND_CONNECTIONS.map((connection) => {
        return array([
            singleHandLandmarks[connection.end].x - singleHandLandmarks[connection.start].x,
            singleHandLandmarks[connection.end].y - singleHandLandmarks[connection.start].y,
            singleHandLandmarks[connection.end].z - singleHandLandmarks[connection.start].z
        ]);
    })
}

function getAngleBetweenConnections(a: NDArrayCore, b: NDArrayCore) {
    if (array_equal(a, b)) {
        return 0
    }
    const dotProduct = dot(a, b) as number;
    const norm = (linalg.norm(a) as number) * (linalg.norm(b) as number)
    return Math.acos(dotProduct / norm);
}

/**
 * A flat array of numbers describing one hand's pose in a single frame.
 *
 * Layout (in order):
 *   [0 .. N²-1]      Pairwise angles (radians) between every combination of the N
 *                    HAND_CONNECTIONS vectors, stored in row-major order (i*N + j).
 *                    N = HandLandmarker.HAND_CONNECTIONS.length.
 *
 *   [N²]   [N²+1] [N²+2]   shoulderToHandVector from the LEFT  shoulder (pose landmark 11):
 *                           [signedSquare(dx), signedSquare(dy), signedSquare(dz)]
 *
 *   [N²+3] [N²+4] [N²+5]   shoulderToHandVector from the RIGHT shoulder (pose landmark 12):
 *                           [signedSquare(dx), signedSquare(dy), signedSquare(dz)]
 *
 * The shoulder tail is always present (6 values); zeros are appended when pose
 * landmarks are unavailable for a frame.
 */
export type FeatureVector = number[];

/** Number of values appended to the angle block for shoulder-to-hand distances (3 per shoulder × 2). */
export const SHOULDER_DATA_LENGTH = 6;

function handCentroid(handLandmarks: NormalizedLandmark[]): { x: number; y: number; z: number } {
    const n = handLandmarks.length;
    const sum = handLandmarks.reduce(
        (acc, lm) => ({ x: acc.x + lm.x, y: acc.y + lm.y, z: acc.z + lm.z }),
        { x: 0, y: 0, z: 0 }
    );
    return { x: sum.x / n, y: sum.y / n, z: sum.z / n };
}

// Returns the vector from shoulder to hand centroid [dx, dy, dz].
// Signs are preserved: negative dy means hand is above the shoulder.
const signedSquare = (v: number) => v * Math.abs(v);

function shoulderToHandVector(
    centroid: { x: number; y: number; z: number },
    shoulder: NormalizedLandmark
): [number, number, number] {
    return [
        signedSquare(centroid.x - shoulder.x),
        signedSquare(centroid.y - shoulder.y),
        signedSquare(centroid.z - shoulder.z),
    ];
}

export function getFeatureVector(frame: Frame): HandsData {
    const result: HandsData = {};
    for (let i = 0; i < frame.handLandmarks.length; i++) {
        const currHandLandmarks = frame.handLandmarks[i];
        const side = frame.handedness[i][0].categoryName.toLowerCase() as "left" | "right";
        const connections = landmarksToConnectionVector(currHandLandmarks);
        const anglesList: FeatureVector = [];
        for (const connectionFrom of connections) {
            for (const connectionTo of connections) {
                const angle = getAngleBetweenConnections(connectionFrom, connectionTo);
                anglesList.push(isNaN(angle) ? 0 : angle);
            }
        }
        const leftShoulder = frame.poseLandmarks[11];
        const rightShoulder = frame.poseLandmarks[12];
        if (leftShoulder && rightShoulder) {
            const centroid = handCentroid(currHandLandmarks);
            anglesList.push(...shoulderToHandVector(centroid, leftShoulder));
            anglesList.push(...shoulderToHandVector(centroid, rightShoulder));
        } else {
            anglesList.push(0, 0, 0, 0, 0, 0);
        }
        result[side] = anglesList;
    }
    return result;
}