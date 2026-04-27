import {HandLandmarker} from "@mediapipe/tasks-vision";
import type {Frame} from "./hand-landmarking.ts";
import {array, array_equal, dot, linalg, NDArrayCore} from "numpy-ts/core";

function landmarksToConnectionVector(allLandmarks: Frame) {
    if (allLandmarks.length < 1) {
        throw new Error("we need at least one hand to compute a feature vector");
    }
    // TODO: going to just look at one hand
    const landmarks = allLandmarks[0];
    return HandLandmarker.HAND_CONNECTIONS.map((connection) => {
        return array([
            landmarks[connection.end].x - landmarks[connection.start].x,
            landmarks[connection.end].y - landmarks[connection.start].y,
            landmarks[connection.end].z - landmarks[connection.start].z
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

export function getFeatureVector(allLandmarks: Frame): FeatureVector {
    const connections = landmarksToConnectionVector(allLandmarks);

    const anglesList: number[] = []
    for (const connectionFrom of connections) {
        for (const connectionTo of connections) {
            const angle = getAngleBetweenConnections(connectionFrom, connectionTo)
            anglesList.push(isNaN(angle) ? 0 : angle)
        }
    }

    return anglesList;
}