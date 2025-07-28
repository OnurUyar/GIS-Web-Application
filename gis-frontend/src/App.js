import React, { useEffect, useState } from "react";
import axios from "axios";

import MapComponent from "./components/MapComponent";
import NavigationBar from "./components/NavigationBar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [points, setPoints] = useState([]);
    const [lines, setLines] = useState([]);
    const [polygons, setPolygons] = useState([]);
    const [showFeatures, setShowFeatures] = useState(true);
    const [addMode, setAddMode] = useState(null);
    const [selectedObject, setSelectedObject] = useState(null);
    const [showPoints, setShowPoints] = useState(true);
    const [showLines, setShowLines] = useState(true);
    const [showPolygons, setShowPolygons] = useState(true);

    useEffect(() => {
        fetchPoints();
        fetchLines();
        fetchPolygons();
    }, []);

    const fetchPoints = async () => {
        try {
            const response = await axios.get("https://localhost:7110/Point");
            setPoints(response.data.data);
        } catch (err) {
            console.error("Error fetching points:", err);
        }
    };

    const fetchLines = async () => {
        try {
            const response = await axios.get("https://localhost:7110/api/Line/getAll");
            console.log("Lines (API Response):", response.data);
            setLines(response.data.data);
        } catch (err) {
            console.error("Error fetching lines:", err);
        }
    };

    const fetchPolygons = async () => {
        try {
            const response = await axios.get("https://localhost:7110/api/Polygon/getAll");
            console.log("Polygons (API Response):", response.data);

            const polygonData = Array.isArray(response.data.data) ? response.data.data : [];
            setPolygons(polygonData);
        } catch (err) {
            console.error("Error fetching polygons:", err);
        }
    };

    const handleSearchSelect = (obj) => {
        setSelectedObject(obj);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1> <center> GIS Web Application </center> </h1>

            {/* Navigation & Search  Bar */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "10px"
            }}>
                <div style={{ flexGrow: 1 }}>
                    <NavigationBar
                        show={showFeatures}
                        setShow={setShowFeatures}
                        setAddMode={setAddMode}
                        points={points}
                        lines={lines}
                        polygons={polygons}
                        onSearchSelect={handleSearchSelect}
                        showPoints={showPoints}
                        setShowPoints={setShowPoints}
                        showLines={showLines}
                        setShowLines={setShowLines}
                        showPolygons={showPolygons}
                        setShowPolygons={setShowPolygons}
                    />
                </div>
            </div>

            <MapComponent
                points={points}
                lines={lines}
                polygons={polygons}
                showPoints={showPoints}
                showLines={showLines}
                showPolygons={showPolygons}
                addMode={addMode}
                setAddMode={setAddMode}
                fetchPoints={fetchPoints}
                fetchLines={fetchLines}
                fetchPolygons={fetchPolygons}
                selectedObject={selectedObject}
            />

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default App;
