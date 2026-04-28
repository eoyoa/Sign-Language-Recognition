import type { Frame, HandsData } from "./landmark-detection";
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
export declare const SHOULDER_DATA_LENGTH = 6;
export declare function getFeatureVector(frame: Frame): HandsData;
