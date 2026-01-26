import axios from "axios";

const API_URL = "http://localhost:4000/api";

async function runVerification() {
    try {
        console.log("Starting verification...");

        // 0. Login
        console.log("\n0. Logging in...");
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: "admin@themillions.com",
            password: "adminpassword123"
        });
        console.log("Login Response:", loginRes.status);
        const token = loginRes.data.token;
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };


        // 1. Create a Page
        console.log("\n1. Creating a Page...");
        const createRes = await axios.post(`${API_URL}/admin/pages`, {
            slug: "test-page-auth",
            title: "Test Page Auth",
            sections: [
                { type: "hero", order: 1, content: { heading: "Welcome Auth" } },
                { type: "text", order: 2, content: { body: "Some text auth" } },
            ],
        }, authHeaders);
        console.log("Create Response:", createRes.status, createRes.data);
        const pageId = createRes.data.id;

        // 2. Get the Page (Public)
        console.log("\n2. Fetching the Page (Public)...");
        const getRes = await axios.get(`${API_URL}/pages/test-page-auth`);
        console.log("Get Response:", getRes.status, getRes.data);

        // 3. Update the Page
        console.log("\n3. Updating the Page...");
        const updateRes = await axios.put(`${API_URL}/admin/pages/${pageId}`, {
            slug: "test-page-auth-updated",
            title: "Test Page Auth Updated",
            sections: [
                { type: "hero", order: 1, content: { heading: "Welcome Auth Updated" } },
            ],
        }, authHeaders);
        console.log("Update Response:", updateRes.status, updateRes.data);

        // 4. Get the Page (Public) - New Slug
        console.log("\n4. Fetching the Page (Public) - New Slug...");
        const getRes2 = await axios.get(`${API_URL}/pages/test-page-auth-updated`);
        console.log("Get Response 2:", getRes2.status, getRes2.data);

        // 5. Delete the Page
        console.log("\n5. Deleting the Page...");
        const deleteRes = await axios.delete(`${API_URL}/admin/pages/${pageId}`, authHeaders);
        console.log("Delete Response:", deleteRes.status, deleteRes.data);

        // 6. Verify Deletion
        console.log("\n6. Verifying Deletion...");
        try {
            await axios.get(`${API_URL}/pages/test-page-auth-updated`);
        } catch (error: any) {
            console.log("Expected 404 Error:", error.response?.status);
        }

        // 7. Verify Validation Failure
        console.log("\n7. Verifying Validation Failure...");
        try {
            await axios.post(`${API_URL}/admin/pages`, {
                slug: "", // invalid
                title: "Invalid Page"
            }, authHeaders);
        } catch (error: any) {
            console.log("Expected 400 Error:", error.response?.status, error.response?.data);
        }

        console.log("\nVerification Complete!");
    } catch (error: any) {
        console.error("Verification Failed:", error.response?.data || error.message);
    }
}

runVerification();
