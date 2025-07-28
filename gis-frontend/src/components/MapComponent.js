import React, { useState, useEffect, useRef } from "react";
import { Button } from 'primereact/button';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Polyline, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { handlePointAdd, updatePoint, deletePoint } from "../handlers/pointHandler";
import { handleLineClick, handleLineFinalize, getTempLine, resetLineDrawing, updateLine, deleteLine } from "../handlers/lineHandler";
import { handlePolygonClick, handlePolygonFinalize, getTempPolygon, resetPolygonDrawing, updatePolygon, deletePolygon } from "../handlers/polygonHandler";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const MapComponent = ({ points, lines, polygons, showPoints, showLines, showPolygons, addMode, setAddMode, fetchPoints, fetchLines, fetchPolygons, selectedObject }) => {
    const [previewPoint, setPreviewPoint] = useState(null);
    const [hoverLatLng, setHoverLatLng] = useState(null);
    const [editing, setEditing] = useState(null);
    const [dummyUpdateTrigger, setDummyUpdateTrigger] = useState(0);
    const tempLineMarkersRef = useRef([]);
    const tempPolygonMarkersRef = useRef([]);
    const originalLatLngRef = useRef(null);
    const markersRef = useRef({});
    const linesRef = useRef({});
    const polygonsRef = useRef({});
    const mapRef = useRef(null);

    useEffect(() => {
        const mapContainer = document.querySelector(".leaflet-container");
        if (!mapContainer) return;

        if (addMode === "point") {
            mapContainer.style.cursor = "none";
        } else if (addMode === "line" || addMode === "polygon") {
            mapContainer.style.cursor = "crosshair";
        } else {
            mapContainer.style.cursor = "";
        }

        return () => {
            mapContainer.style.cursor = "";
        };
    }, [addMode]);

    useEffect(() => {
        if (editing !== null) {
            setDummyUpdateTrigger(prev => prev + 1);
        }
    }, [hoverLatLng, editing]);

    // HANDLERS FOR MAP EVENTS

    const MapHoverHandler = () => {
        useMapEvents({
            mousemove(e) {
                if (["point", "line", "polygon"].includes(addMode)) {
                    const { lat, lng } = e.latlng;
                    setHoverLatLng({ lat, lng });
                    setDummyUpdateTrigger(prev => prev + 1);
                } else {
                    setHoverLatLng(null);
                }
            }
        });
        return null;
    };

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                if (addMode === "point") {
                    const { lat, lng } = e.latlng;
                    setPreviewPoint({ lat, lng });
                    handlePointAdd({ lat, lng, fetchPoints, setAddMode, setPreviewPoint });
                }
            }
        });
        return null;
    };

    const MapLineHandler = () => {
        useMapEvents({
            click(e) {
                if (addMode === "line") handleLineClick(e.latlng);
            },
            keydown(e) {
                if (addMode === "line") {
                    if (e.originalEvent.key === "Enter") handleLineFinalize({ fetchLines, setAddMode });
                    else if (e.originalEvent.key === "Escape") {
                        resetLineDrawing();
                        setAddMode(null);
                    }
                }
            }
        });
        return null;
    };

    const MapPolygonHandler = () => {
        useMapEvents({
            click(e) {
                if (addMode === "polygon") handlePolygonClick(e.latlng);
            },
            keydown(e) {
                if (addMode === "polygon") {
                    if (e.originalEvent.key === "Enter") handlePolygonFinalize({ fetchPolygons, setAddMode });
                    else if (e.originalEvent.key === "Escape") {
                        resetPolygonDrawing();
                        setAddMode(null);
                    }
                }
            }
        });
        return null;
    };

    const customBlueMarker = new L.DivIcon({
        className: 'custom-marker',
        html: `<div class="custom-marker-inner"></div>`,
        iconSize: [20, 20]
    });

    const customGreenMarker = new L.DivIcon({
        className: 'custom-green-marker',
        html: `<div class="custom-green-marker-inner"></div>`,
        iconSize: [14, 14]
    });

    // EDITING FUNCTIONS
    function handleEditPoint(point) {
        const marker = markersRef.current[point.id];
        if (!marker) return;
        marker.dragging.enable();
        setEditing(`point-${point.id}`);
        originalLatLngRef.current = marker.getLatLng();

        const escListener = (e) => {
            if (e.key === "Escape") {
                marker.setLatLng(originalLatLngRef.current);
                marker.dragging.disable();
                setEditing(null);
                window.removeEventListener("keydown", escListener);
                window.removeEventListener("keydown", enterListener);
            }
        };

        const enterListener = (e) => {
            if (e.key === "Enter") {
                marker.dragging.disable();
                const newLatLng = marker.getLatLng();
                const newName = prompt("Enter the new name:", point.name);
                if (newName !== null) updatePoint(point.id, newName, newLatLng.lat, newLatLng.lng, fetchPoints);
                setEditing(null);
                window.removeEventListener("keydown", escListener);
                window.removeEventListener("keydown", enterListener);
            }
        };

        window.addEventListener("keydown", escListener);
        window.addEventListener("keydown", enterListener);
    }

    function handleEditLine(line) {
        const originalCoords = parseWKTLineString(line.wkt);
        if (!originalCoords || originalCoords.length < 2) {
            alert("Original coordinates could not be parsed.");
            return;
        }
        const markerArray = originalCoords.map(([lat, lng]) => ({ lat, lng }));
        tempLineMarkersRef.current = markerArray;
        setEditing(`line-${line.id}`);

        const escListener = (e) => {
            if (e.key === "Escape") {
                tempLineMarkersRef.current = [];
                setEditing(null);
                window.removeEventListener("keydown", escListener);
                window.removeEventListener("keydown", enterListener);
            }
        };

        const enterListener = (e) => {
            if (e.key === "Enter") {
                const newCoords = tempLineMarkersRef.current;
                if (!newCoords || newCoords.length < 2 || newCoords.some(p => !p.lat || !p.lng)) {
                    alert("Invalid coordinates.");
                    return;
                }
                const newWKT = `LINESTRING(${newCoords.map(p => `${p.lng} ${p.lat}`).join(", ")})`;
                const newName = prompt("Enter the new name:", line.name);
                if (newName !== null) updateLine(line.id, newName, newWKT, fetchLines);
                tempLineMarkersRef.current = [];
                setEditing(null);
                window.removeEventListener("keydown", escListener);
                window.removeEventListener("keydown", enterListener);
            }
        };

        window.addEventListener("keydown", escListener);
        window.addEventListener("keydown", enterListener);
    }

    function handleEditPolygon(polygon) {
        const originalCoords = parseWKTPolygon(polygon.wkt)?.[0];
        if (!originalCoords || originalCoords.length < 3) {
            alert("Original coordinates could not be parsed.");
            return;
        }
        const markerArray = originalCoords.map(([lat, lng]) => ({ lat, lng }));
        if (
            markerArray.length > 1 &&
            markerArray[0].lat === markerArray[markerArray.length - 1].lat &&
            markerArray[0].lng === markerArray[markerArray.length - 1].lng
        ) {
            markerArray.pop();
        }
        tempPolygonMarkersRef.current = markerArray;
        setEditing(`polygon-${polygon.id}`);

        const escListener = (e) => {
            if (e.key === "Escape") {
                tempPolygonMarkersRef.current = [];
                setEditing(null);
                window.removeEventListener("keydown", escListener);
                window.removeEventListener("keydown", enterListener);
            }
        };

        const enterListener = (e) => {
            if (e.key === "Enter") {
                const newCoords = tempPolygonMarkersRef.current;
                if (!newCoords || newCoords.length < 3 || newCoords.some(p => !p.lat || !p.lng)) {
                    alert("Invalid coordinates.");
                    return;
                }
                const closedCoords = [...newCoords, newCoords[0]];
                const newWKT = `POLYGON((` + closedCoords.map(p => `${p.lng} ${p.lat}`).join(", ") + `))`;
                const newName = prompt("Enter the new name:", polygon.name);
                if (newName !== null) updatePolygon(polygon.id, newName, newWKT, fetchPolygons);
                tempPolygonMarkersRef.current = [];
                setEditing(null);
                window.removeEventListener("keydown", escListener);
                window.removeEventListener("keydown", enterListener);
            }
        };

        window.addEventListener("keydown", escListener);
        window.addEventListener("keydown", enterListener);
    }

    function MapEffect({ selectedObject }) {
        const map = useMap();

        useEffect(() => {
            if (!selectedObject || !map) return;

            let center = null;

            if (selectedObject.type === "Point") {
                center = [selectedObject.latitude, selectedObject.longitude];
                map.flyTo(center, 14);

                const marker = markersRef.current[selectedObject.id];
                if (marker) marker.openPopup();
            }

            else if (selectedObject.type === "Line") {
                try {
                    center = extractCenterFromWKT(selectedObject.wkt);
                    map.flyTo(center, 13);

                    const lineLayer = linesRef.current[selectedObject.id];
                    if (lineLayer) lineLayer.openPopup();
                } catch (err) {
                    console.warn("Could not parse WKT for line:", err);
                }
            }

            else if (selectedObject.type === "Polygon") {
                try {
                    center = extractCenterFromWKT(selectedObject.wkt);
                    map.flyTo(center, 13);

                    const polygonLayer = polygonsRef.current[selectedObject.id];
                    if (polygonLayer) polygonLayer.openPopup();
                } catch (err) {
                    console.warn("Could not parse WKT for polygon:", err);
                }
            }

        }, [selectedObject, map]);

        return null;
    }

    // WKT OPERATIONS FUNCTIONS

    const parseWKTPolygon = (wkt) => {
        if (!wkt?.toUpperCase().startsWith("POLYGON")) return [];
        const coordText = wkt.slice(wkt.indexOf("((") + 2, wkt.indexOf("))"));
        return [coordText.split(",").map(pair => {
            const [lon, lat] = pair.trim().split(" ").map(Number);
            return [lat, lon];
        })];
    };

    const parseWKTLineString = (wkt) => {
        if (!wkt?.toUpperCase().startsWith("LINESTRING")) return [];
        const coordText = wkt.slice(wkt.indexOf("(") + 1, wkt.indexOf(")"));
        return coordText.split(",").map(pair => {
            const [lon, lat] = pair.trim().split(" ").map(Number);
            return [lat, lon];
        });
    };

    const extractCenterFromWKT = (wkt) => {
        const numbers = wkt.match(/[-\d.]+/g)?.map(Number);
        if (!numbers || numbers.length < 2) throw new Error("Invalid WKT");

        const lats = [], lngs = [];
        for (let i = 0; i < numbers.length; i += 2) {
            lngs.push(numbers[i]);
            lats.push(numbers[i + 1]);
        }

        const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        return [avgLat, avgLng];
    };

    return (
        <MapContainer center={[38.9637, 35.2433]} zoom={6} style={{ height: "80vh", width: "100%" }} whenCreated={map => { mapRef.current = map; window.mapInstance = map; }}>
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler />
            <MapHoverHandler />
            <MapLineHandler />
            <MapPolygonHandler />
            <MapEffect selectedObject={selectedObject} />

            {/* ADD MODES */}

            {addMode === "point" && hoverLatLng && <Marker position={[hoverLatLng.lat, hoverLatLng.lng]} icon={customBlueMarker} opacity={0.3} interactive={false} />}
            {previewPoint && <Marker position={[previewPoint.lat, previewPoint.lng]} opacity={0.4}><Popup>Selected Location</Popup></Marker>}

            {addMode === "line" && getTempLine().length >= 1 && hoverLatLng && <Polyline positions={[...getTempLine(), hoverLatLng].map(p => [p.lat, p.lng])} pathOptions={{ color: "gray", dashArray: "5, 5" }} />}
            {addMode === "line" && (
                <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", zIndex: 1000 }}>
                    Press <strong>ENTER</strong> to complete the line, <strong>ESC</strong> to cancel.
                </div>
            )}

            {addMode === "polygon" && getTempPolygon().length >= 1 && (
                <>
                    {hoverLatLng && <Polygon positions={[...getTempPolygon(), hoverLatLng].map(p => [p.lat, p.lng])} pathOptions={{ color: "rgba(0, 128, 0, 0.5)", dashArray: "5, 5" }} />}
                    {getTempPolygon().map((p, i) => <Marker key={`temp-poly-point-${i}`} position={[p.lat, p.lng]} icon={customGreenMarker} opacity={1} interactive={false} />)}
                </>
            )}
            {addMode === "polygon" && (
                <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", zIndex: 1000 }}>
                    Press <strong>ENTER</strong> to complete the polygon, <strong>ESC</strong> to cancel.
                </div>
            )}

            {/* EDIT MODES */}

            {editing !== null && <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", zIndex: 1000 }}>Press <strong>ENTER</strong> to save the object, <strong>ESC</strong> to cancel.</div>}

            {editing?.startsWith("line-") && tempLineMarkersRef.current.map((pos, index) => (
                <Marker
                    key={`edit-line-${index}`}
                    position={[pos.lat, pos.lng]}
                    draggable={true}
                    eventHandlers={{
                        dragend: (e) => {
                            const updated = [...tempLineMarkersRef.current];
                            updated[index] = {
                                lat: e.target.getLatLng().lat,
                                lng: e.target.getLatLng().lng,
                            };
                            tempLineMarkersRef.current = updated;
                        }
                    }}
                    icon={L.divIcon({ className: 'edit-marker', html: '<div style="background:red;width:10px;height:10px;border-radius:50%;opacity:0.6;"></div>' })}
                />
            ))}
            {editing?.startsWith("line-") && tempLineMarkersRef.current.length > 1 && (
                <Polyline positions={tempLineMarkersRef.current.map(p => [p.lat, p.lng])} pathOptions={{ color: "red", dashArray: "5, 5" }} />
            )}
            {editing?.startsWith("line-") && hoverLatLng && tempLineMarkersRef.current.length >= 1 && (
                <Polyline
                    key={`editing-hover-line-${dummyUpdateTrigger}`}
                    positions={[...tempLineMarkersRef.current.map(p => [p.lat, p.lng]), [hoverLatLng.lat, hoverLatLng.lng]]}
                    pathOptions={{ color: "gray", dashArray: "5, 5" }}
                />
            )}

            {editing?.startsWith("polygon-") && tempPolygonMarkersRef.current.map((pos, index) => (
                <Marker
                    key={`edit-polygon-${index}`}
                    position={[pos.lat, pos.lng]}
                    draggable={true}
                    eventHandlers={{
                        dragend: (e) => {
                            const updated = [...tempPolygonMarkersRef.current];
                            updated[index] = {
                                lat: e.target.getLatLng().lat,
                                lng: e.target.getLatLng().lng,
                            };
                            tempPolygonMarkersRef.current = updated;
                        }
                    }}
                    icon={L.divIcon({ className: 'edit-marker', html: '<div style="background:green;width:10px;height:10px;border-radius:50%;opacity:0.6;"></div>' })}
                />
            ))}

            {editing?.startsWith("polygon-") && tempPolygonMarkersRef.current.length >= 3 && (
                <Polygon
                    positions={[...tempPolygonMarkersRef.current.map(p => [p.lat, p.lng]), [tempPolygonMarkersRef.current[0].lat, tempPolygonMarkersRef.current[0].lng]]}
                    pathOptions={{ color: "green", dashArray: "5, 5" }}
                />
            )}

            {/* SHOWING OBJECTS */}

            {showPoints && points.map((point) => (
                <Marker
                    key={point.id}
                    position={[point.latitude, point.longitude]}
                    icon={customBlueMarker}
                    ref={(ref) => { if (ref) markersRef.current[point.id] = ref; }}
                >
                    <Popup>
                        <strong>{point.name}</strong><br />
                        ID: {point.id}<br />
                        Latitude: {point.latitude}<br />
                        Longitude: {point.longitude}<br />
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginTop: "10px" }}>
                            <Button icon="pi pi-pencil" label="Edit" className="p-button-sm p-button-secondary" onClick={() => handleEditPoint(point)}></Button>
                            <Button icon="pi pi-times" label="Delete" className="p-button-sm p-button-danger" onClick={() => deletePoint(point.id, fetchPoints)}></Button>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {showLines && lines.map((line) => (
                <Polyline
                    key={line.id}
                    positions={parseWKTLineString(line.wkt)}
                    pathOptions={{ color: "red" }}
                    ref={(ref) => { if (ref) linesRef.current[line.id] = ref; }}
                >
                    <Popup>
                        <strong>{line.name}</strong><br />
                        ID: {line.id}<br />
                        Length (km): {line.lengthKm.toFixed(2)} km<br />
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginTop: "10px" }}>
                            <Button icon="pi pi-pencil" label="Edit" className="p-button-sm p-button-secondary" onClick={() => handleEditLine(line)}></Button>
                            <Button icon="pi pi-times" label="Delete" className="p-button-sm p-button-danger" onClick={() => deleteLine(line.id, fetchLines)}></Button>
                        </div>
                    </Popup>
                </Polyline>
            ))}

            {showPolygons && polygons.map((polygon) => (
                polygon.wkt && <Polygon
                    key={polygon.id}
                    positions={parseWKTPolygon(polygon.wkt)}
                    pathOptions={{ color: "green" }}
                    ref={(ref) => { if (ref) polygonsRef.current[polygon.id] = ref; }}
                >
                    <Popup>
                        <strong>{polygon.name}</strong><br />
                        ID: {polygon.id}<br />
                        Area (km²): {polygon.areaKm2}<br />
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginTop: "10px" }}>
                            <Button icon="pi pi-pencil" label="Edit" className="p-button-sm p-button-secondary" onClick={() => handleEditPolygon(polygon)}></Button>
                            <Button icon="pi pi-times" label="Delete" className="p-button-sm p-button-danger" onClick={() => deletePolygon(polygon.id, fetchPolygons)}></Button>
                        </div>
                    </Popup>
                </Polygon>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
