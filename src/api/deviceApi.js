import axios from 'axios';

const API_URL = 'https://localhost:7019/api/ThietBi';

const DeviceApi = {
    async getAllDevices() {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error fetching devices:", error);
            throw error;
        }
    },

    async getDeviceById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching device with id ${id}:`, error);
            throw error;
        }
    },

    async createDevice(device) {
        try {
            const response = await axios.post(API_URL, device);
            return response.data;
        } catch (error) {
            console.error("Error creating device:", error);
            throw error;
        }
    },

    async updateDevice(id, device) {
        try {
            await axios.put(`${API_URL}/${id}`, device);
        } catch (error) {
            console.error(`Error updating device with id ${id}:`, error);
            throw error;
        }
    },

    async deleteDevice(id) {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            console.error(`Error deleting device with id ${id}:`, error);
            throw error;
        }
    }
};

export default DeviceApi;
