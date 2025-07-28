import React, { useState, useEffect } from "react";
import { InputText } from 'primereact/inputtext';
import debounce from "lodash.debounce";

function SearchComponent({ onSelect, points, lines, polygons }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [noResult, setNoResult] = useState(false);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([]);
            setNoResult(false);
            return;
        }

        const debouncedSearch = debounce(() => {
            const lower = searchTerm.toLowerCase();

            const filteredPoints = points
                .filter(p => p.name.toLowerCase().includes(lower))
                .map(p => ({ type: "Point", ...p }));

            const filteredLines = lines
                .filter(l => l.name.toLowerCase().includes(lower))
                .map(l => ({ type: "Line", ...l }));

            const filteredPolygons = polygons
                .filter(g => g.name.toLowerCase().includes(lower))
                .map(g => ({ type: "Polygon", ...g }));

            const combined = [...filteredPoints, ...filteredLines, ...filteredPolygons];
            setResults(combined);
            setNoResult(combined.length === 0);
        }, 300);

        debouncedSearch();

        return () => debouncedSearch.cancel();
    }, [searchTerm, points, lines, polygons]);

    const handleClick = (item) => {
        onSelect(item);
        setSearchTerm("");
        setResults([]);
    };

    return (
        <div className="p-input-icon-left" style={{ width: "100%", position: "relative" }}>
            <i className="pi pi-search" style={{ position: "absolute", left: "0.75rem", top: "65%", transform: "translateY(-50%)", color: "gray" }} />
            <InputText
                type="text"
                placeholder="Search for object by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: "2rem", width: "100%" }}
            />
            {results.length > 0 && (
                <ul style={{
                    position: "absolute",
                    top: "40px",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    maxHeight: "300px",
                    overflowY: "auto",
                    zIndex: 1000,
                    listStyle: "none",
                    padding: 0,
                    margin: 0
                }}>
                    {results.map((item, idx) => (
                        <li
                            key={`${item.type}-${item.id}-${idx}`}
                            style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                            onClick={() => handleClick(item)}
                        >
                            <strong>{item.type}</strong> — {item.name} (ID: {item.id})
                        </li>
                    ))}
                </ul>
            )}
            {noResult && (
                <div style={{
                    position: "absolute",
                    top: "40px",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    padding: "8px",
                    zIndex: 1000
                }}>
                    There is no result.
                </div>
            )}
        </div>
    );
};

export default SearchComponent;
