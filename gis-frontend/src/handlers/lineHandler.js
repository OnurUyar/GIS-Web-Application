import { toast } from "react-toastify";
import axios from "axios";

let currentPoints = [];

export const resetLineDrawing = () => {
    currentPoints = [];
};

export const handleLineClick = (latlng) => {
    currentPoints.push(latlng);
};

export const getTempLine = () => {
    return currentPoints;
};

export const handleLineFinalize = async ({ fetchLines, setAddMode }) => {
    if (currentPoints.length < 2) {
        toast.error("At least 2 points are required to form a line.");
        return;
    }

    const name = prompt("Enter name for line:");
    if (!name) {
        resetLineDrawing();
        setAddMode(null);
        return;
    }

    const wkt = `LINESTRING(${currentPoints.map(p => `${p.lng} ${p.lat}`).join(", ")})`;

    try {
        const res = await fetch("https://localhost:7110/api/Line/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, wkt }),
        });

        if (!res.ok) throw new toast.error("Error adding line");

        toast.success("Line added!");
        fetchLines();
    } catch (err) {
        console.error(err);
        toast.error("Error adding line");
    } finally {
        resetLineDrawing();
        setAddMode(null);
    }
};

export async function updateLine(id, newName, newWKT, fetchLines) {
    try {
        console.log("Sending update:", { name: newName, wkt: newWKT });
        await axios.put(`https://localhost:7110/api/Line/update/${id}`, {
            name: newName,
            wkt: newWKT
        });
        toast.success("Line updated successfully.");
        fetchLines && fetchLines();
    } catch (err) {
        console.error("Update line error:", err);
        toast.error("Line update failed.");
    }
}

export async function deleteLine(id, fetchLines) {
    if (!window.confirm("Are you sure you want to delete this line?")) return;

    try {
        await axios.delete(`https://localhost:7110/api/Line/delete/${id}`);
        toast.success("Line deleted successfully.");
        fetchLines && fetchLines();
    } catch (err) {
        console.error("Delete line error:", err);
        toast.error("Line delete failed.");
    }
}
