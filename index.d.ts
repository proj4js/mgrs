declare module "mgrs" {
    /**
     * Convert lat/long to MGRS.
     *
     * @param {[number, number]} An array with longitude and latitude on a
     *     WGS84 ellipsoid.
     * @param {number} [accuracy=5] Accuracy in digits (5 for 1 m, 4 for 10 m, 3 for
     *      100 m, 2 for 1 km, 1 for 10 km or 0 for 100 km). Optional, default is 5.
     * @return {string} the MGRS string for the given location and accuracy.
     */
    export function LLtoMGRS(ll: [number,number], accuracy?: number): string;

    /**
     * Convert MGRS to lat/long bounding box.
     *
     * @param {string} mgrs MGRS string.
     * @return {[number,number,number,number]} An array with left (longitude),
     *    bottom (latitude), right
     *    (longitude) and top (latitude) values in WGS84, representing the
     *    bounding box for the provided MGRS reference.
     */
    export function MGRStoBBoxLL(mgrs: string): [number,number,number,number];

    /**
     * Convert MGRS to lat/long point.
     *
     * @param {string} mgrs MGRS string.
     * @return {[number,number]} An array with longitude and latitude values in
     *    WGS84, representing the center point of the provided MGRS reference.
     */
    export function MGRStoLL(mgrs: string): [number,number];
}
