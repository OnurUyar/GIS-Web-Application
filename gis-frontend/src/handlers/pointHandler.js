import { toast } from "react-toastify";
import axios from "axios";

export const handlePointAdd = async ({ lat, lng, fetchPoints, setAddMode, setPreviewPoint }) => {
    const name = prompt("Enter name for point:");
    if (!name) {
        setAddMode(null);
        setPreviewPoint(null);
        return;
    }

    try {
        const response = await fetch("https://localhost:7110/Point", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                latitude: lat,
                longitude: lng,
            }),
        });

        if (!response.ok) {
            throw new toast.error("Error adding point");
        }

        toast.success("Point added successfully!");
        fetchPoints();
        setPreviewPoint(null);
        setAddMode(null);
    } catch (err) {
        console.error(err);
        toast.error("Error adding point");
    }
};

export async function updatePoint(id, newName, lat, lng, fetchPoints) {
    try {
        await axios.put(`https://localhost:7110/Point/${id}`, {
            name: newName,
            latitude: lat,
            longitude: lng
        });
        toast.success("Point updated successfully.");
        fetchPoints && fetchPoints();
    } catch (err) {
        console.error("Update point error:", err);
        toast.error("Point update failed.");
    }
}

export async function deletePoint(id, fetchPoints) {
    if (!window.confirm("Are you sure you want to delete this point?")) return;

    try {
        await axios.delete(`https://localhost:7110/Point/${id}`);
        toast.success("Point deleted successfully.");
        fetchPoints && fetchPoints();
    } catch (err) {
        console.error("Delete point error:", err);
        toast.error("Point delete failed.");
    }
}
