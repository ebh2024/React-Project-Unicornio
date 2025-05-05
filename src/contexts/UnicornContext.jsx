import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const UnicornContext = createContext(null);

const API_BASE_URL = 'https://crudcrud.com/api/d6fb9d41aaef4f7c85cb51e424d49055/unicorns';

export const UnicornProvider = ({ children }) => {
  const [unicorns, setUnicorns] = useState([]);

  const getUnicorns = useCallback(async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setUnicorns(response.data);
    } catch (error) {
      console.error('Error fetching unicorns:', error);
    }
  }, []);

  const createUnicorn = async (unicorn) => {
    try {
      const response = await axios.post(API_BASE_URL, unicorn);
      setUnicorns(prevUnicorns => [...prevUnicorns, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating unicorn:', error);
    }
  };

  const editUnicorn = async (unicorn) => {
    try {
      const { _id, ...unicornData } = unicorn;
      const response = await axios.put(API_BASE_URL + '/' + _id, unicornData);
      setUnicorns(prevUnicorns => prevUnicorns.map(u => (u._id === unicorn._id ? response.data : u)));
    } catch (error) {
      console.error('Error editing unicorn:', error);
    }
  };

  const deleteUnicorn = async (id) => {
    try {
      await axios.delete(API_BASE_URL + '/' + id);
      setUnicorns(prevUnicorns => prevUnicorns.filter(u => u._id !== id));
    } catch (error) {
      console.error('Error deleting unicorn:', error);
    }
  };

  useEffect(() => {
    getUnicorns();
  }, [getUnicorns]);

  const value = {
    unicorns,
    setUnicorns,
    getUnicorns,
    createUnicorn,
    editUnicorn,
    deleteUnicorn,
  };

  return (
    <UnicornContext.Provider value={value}>
      {children}
    </UnicornContext.Provider>
  );
};

export default UnicornProvider;
