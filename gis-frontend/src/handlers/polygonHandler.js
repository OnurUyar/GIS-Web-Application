import axios from "axios";
import { toast } from "react-toastify";

let currentPolygonPoints = [];

export const resetPolygonDrawing = () => {
    currentPolygonPoints = [];
};

export const handlePolygonClick = (latlng) => {
    currentPolygonPoints.push(latlng);
};

export const getTempPolygon = () => {
    return currentPolygonPoints;
};

export const handlePolygonFinalize = async ({ fetchPolygons, setAddMode }) => {
    if (currentPolygonPoints.length < 3) {
        toast.error("At least 3 points are required to form a polygon.");
        return;
    }

    const name = prompt("Enter name for polygon:");
    if (!name) {
        resetPolygonDrawing();
        setAddMode(null);
        return;
    }

    const coords = currentPolygonPoints.map(p => `${p.lng} ${p.lat}`).join(", ");
    const wkt = `POLYGON(( ${coords}, ${currentPolygonPoints[0].lng} ${currentPolygonPoints[0].lat} ))`; // first point again to close loop

    try {
        const res = await fetch("https://localhost:7110/api/Polygon/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, wkt }),
        });

        if (!res.ok) throw new Error("Failed to add polygon");

        toast.success("Polygon added!");
        fetchPolygons();
    } catch (err) {
        console.error(err);
        toast.error("Error adding polygon");
    } finally {
        resetPolygonDrawing();
        setAddMode(null);
    }
};

export const updatePolygon = async (id, newName, newWKT, fetchPolygons) => {
    try {
        const request = {
            name: newName,
            wkt: newWKT
        };

        const response = await axios.put(`https://localhost:7110/api/Polygon/update/${id}`, request);

        if (response.data.status === "Success") {
            toast.success("Polygon updated successfully!");
            fetchPolygons();
        } else {
            toast.error(`Update failed: ${response.data.message}`);
        }
    } catch (error) {
        console.error("Error updating polygon:", error);
        toast.error("An error occurred while updating the polygon.");
    }
};

export async function deletePolygon(id, fetchPolygons) {
    if (!window.confirm("Are you sure you want to delete this polygon?")) return;

    try {
        await axios.delete(`https://localhost:7110/api/Polygon/delete/${id}`);
        toast.success("Polygon deleted successfully.");
        fetchPolygons && fetchPolygons();
    } catch (err) {
        console.error("Delete polygon error:", err);
        toast.error("Polygon delete failed.");
    }
}
