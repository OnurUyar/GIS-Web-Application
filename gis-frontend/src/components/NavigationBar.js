import React, { useState, useEffect, useRef } from "react";
import SearchComponent from "./SearchComponent";
import { Button } from 'primereact/button';

const NavigationBar = ({ show, setShow, setAddMode, points, lines, polygons, onSearchSelect, showPoints, setShowPoints, showLines, setShowLines, showPolygons, setShowPolygons }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showOptionsVisible, setShowOptionsVisible] = useState(false);
    const showAll = showPoints && showLines && showPolygons;

    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowOptionsVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleShowAllChange = (e) => {
        const isChecked = e.target.checked;
        setShowPoints(isChecked);
        setShowLines(isChecked);
        setShowPolygons(isChecked);
    };

    const handleShowPointsChange = (e) => {
        setShowPoints(e.target.checked);
    };

    const handleShowLinesChange = (e) => {
        setShowLines(e.target.checked);
    };

    const handleShowPolygonsChange = (e) => {
        setShowPolygons(e.target.checked);
    };

    const handleAddMode = (mode) => {
        setAddMode(mode);
        setShowDropdown(false);
    };

    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px 10px 60px",
                borderBottom: "1px solid #ccc",
                marginBottom: "10px",
                backgroundColor: "#f8f8f8",
                width: "100%"
            }}
        >
            <div style={{ position: "relative" }} ref={containerRef}>
                <Button icon="pi pi-eye" label="Show" className="p-button-rounded p-button-secondary" onClick={() => setShowOptionsVisible(!showOptionsVisible)}></Button>
                {showOptionsVisible && (
                    <div style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            padding: "10px",
                            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                            zIndex: 1000
                        }}>

                        <div style={{ marginBottom: "8px" }}>
                            <input className="form-check-input" type="checkbox" id="showAll" checked={showAll} onChange={handleShowAllChange} />
                            <label className="form-check-label" htmlFor="showAll" style={{ marginLeft: "5px" }}>
                                Show all objects.
                            </label>
                        </div>
                        <div style={{ paddingLeft: "16px" }}>
                            <div style={{ marginBottom: "4px" }}>
                                <input className="form-check-input" type="checkbox" id="showPoints" checked={showPoints} onChange={handleShowPointsChange} />
                                <label className="form-check-label" htmlFor="showPoints" style={{ marginLeft: "5px" }}>Show points.</label>
                            </div>
                            <div style={{ marginBottom: "4px" }}>
                                <input className="form-check-input" type="checkbox" id="showLines" checked={showLines} onChange={handleShowLinesChange} />
                                <label className="form-check-label" htmlFor="showLines" style={{ marginLeft: "5px" }}>Show lines.</label>
                            </div>
                            <div>
                                <input className="form-check-input" type="checkbox" id="showPolygons" checked={showPolygons} onChange={handleShowPolygonsChange} />
                                <label className="form-check-label" htmlFor="showPolygons" style={{ marginLeft: "5px" }}>Show polygons.</label>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ position: "relative" }}>
                <Button icon="pi pi-plus-circle" label="Add" className="p-button-rounded p-button-secondary" onClick={() => setShowDropdown(!showDropdown)}></Button>
                {showDropdown && (
                    <div style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        padding: "5px",
                        zIndex: 1000,
                        display: "flex",
                        flexDirection: "column",
                        minWidth: "120px"
                    }}>
                        <button onClick={() => handleAddMode("point")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "6px", border: "none", background: "none", cursor: "pointer" }}>
                            <i className="pi pi-circle-fill" style={{ color: "#007bff", fontSize: "0.7rem" }}></i> Point
                        </button>
                        <button onClick={() => handleAddMode("line")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "6px", border: "none", background: "none", cursor: "pointer" }}>
                            <i className="pi pi-arrows-h" style={{ color: "red" }}></i> Line
                        </button>
                        <button onClick={() => handleAddMode("polygon")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "6px", border: "none", background: "none", cursor: "pointer" }}>
                            <i className="pi pi-folder" style={{ color: "green" }}></i> Polygon
                        </button>
                    </div>
                )}
            </div>

            <div style={{ marginLeft: "10px", flex: 1, maxWidth: "300px" }}>
                <SearchComponent
                    onSelect={onSearchSelect}
                    points={points}
                    lines={lines}
                    polygons={polygons}
                />
            </div>
        </nav>
    );
};

export default NavigationBar;
