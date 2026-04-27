import {HandLandmarker, type NormalizedLandmark} from "@mediapipe/tasks-vision";
import type {Frame} from "./hand-landmarking.ts";
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

export type FeatureVector = number[];

export function getFeatureVector(allLandmarks: Frame): FeatureVector[] {

    const allAngles: FeatureVector[] = []
    for (const currHandLandmarks of allLandmarks) {
        const connections = landmarksToConnectionVector(currHandLandmarks);
        const anglesList: FeatureVector = []
        for (const connectionFrom of connections) {
            for (const connectionTo of connections) {
                const angle = getAngleBetweenConnections(connectionFrom, connectionTo)
                anglesList.push(isNaN(angle) ? 0 : angle)
            }
        }
        allAngles.push(anglesList)
    }


    return allAngles;
}