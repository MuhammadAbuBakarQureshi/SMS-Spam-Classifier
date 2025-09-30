import React, { use, useState } from "react";
import './Form.css'

export default function Form() {

    const [formData, setFormData] = useState("");
    const [prediction, setPrediction] = useState("");

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        
        try{

            let response = await fetch("http://localhost:8080/api/sms", {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({sms: formData})
            })

            if(!response.ok){

                throw new Error (`http error : ${response.status}`);
            }

            let result = await response.json();

            setPrediction(result.data);
            setFormData("");
            
        } catch(error){

            console.error(`Error formData: ${error}`);
        }
    }

    return (
        <div className="container mt-5">
        <h2 className="mb-4 text-center">SMS spam classifier</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
            <label htmlFor="formData" className="form-label">Message</label>
            <textarea
                className="form-control no-resize"
                id="formData"
                rows="4"
                placeholder="💬 Enter your SMS to check spam..."
                maxLength={500}
                value={formData}
                onChange={(e) => setFormData(e.target.value)}
            ></textarea>
            <div className="form-text text-end">
                {formData.length}/500 characters
            </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
            Submit
            </button>

            {prediction && (
                    <p
                    style={{
                        marginTop: "20px",
                        fontWeight: "bold",
                        color: prediction.label === "ham" ? "green" : "red",
                        fontSize: "18px",
                    }}
                    >
                    {prediction.label.toUpperCase()}
                    </p>
                )}

        </form>
        </div>
    );
}