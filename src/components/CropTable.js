import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import data from '../data/data.json';
import './CropTable.css';

const CropTable = () => {
    const [maxMinTable, setMaxMinTable] = useState([]);
    const [averageTable, setAverageTable] = useState([]);

    useEffect(() => {
        const processedData = processData(data);
        setMaxMinTable(processedData.maxMinTable);
        setAverageTable(processedData.averageTable);
    }, []);

    const processData = (data) => {
        const cropData = {};
        const years = new Set();

        data.forEach(item => {
            const year = item.Year.split(', ')[1];
            years.add(year);

            if (!cropData[item['Crop Name']]) {
                cropData[item['Crop Name']] = {
                    totalYield: 0,
                    totalArea: 0,
                    count: 0,
                };
            }

            const production = item['Crop Production (UOM:t(Tonnes))'] || 0;
            const yieldVal = item['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))'] || 0;
            const area = item['Area Under Cultivation (UOM:Ha(Hectares))'] || 0;

            cropData[item['Crop Name']].totalYield += parseFloat(yieldVal);
            cropData[item['Crop Name']].totalArea += parseFloat(area);
            cropData[item['Crop Name']].count += 1;
        });

        const maxMinTable = Array.from(years).sort().map(year => {
            const yearlyData = data.filter(item => item.Year.includes(year));
            const maxCrop = yearlyData.reduce((max, item) =>
                parseFloat(item['Crop Production (UOM:t(Tonnes))'] || 0) > parseFloat(max['Crop Production (UOM:t(Tonnes))'] || 0) ? item : max, {});
            const minCrop = yearlyData.reduce((min, item) =>
                parseFloat(item['Crop Production (UOM:t(Tonnes))'] || 0) < parseFloat(min['Crop Production (UOM:t(Tonnes))'] || 0) ? item : min, {});

            return {
                year,
                maxCrop: maxCrop['Crop Name'] || 'N/A',
                minCrop: minCrop['Crop Name'] || 'N/A'
            };
        });

        const averageTable = Object.keys(cropData).map(crop => {
            return {
                crop,
                avgYield: (cropData[crop].totalYield / cropData[crop].count).toFixed(3),
                avgArea: (cropData[crop].totalArea / cropData[crop].count).toFixed(3)
            };
        });

        return { maxMinTable, averageTable };
    };

    return (
        <div>
            <h2>Crop Production Statistics</h2>
            <h3>Maximum and Minimum Crop Production by Year</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Crop with Maximum Production</th>
                        <th>Crop with Minimum Production</th>
                    </tr>
                </thead>
                <tbody>
                    {maxMinTable.map((row, index) => (
                        <tr key={index}>
                            <td>{row.year}</td>
                            <td>{row.maxCrop}</td>
                            <td>{row.minCrop}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h3>Average Yield and Cultivation Area (1950-2020)</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Crop</th>
                        <th>Average Yield (Kg/Ha)</th>
                        <th>Average Cultivation Area (Ha)</th>
                    </tr>
                </thead>
                <tbody>
                    {averageTable.map((row, index) => (
                        <tr key={index}>
                            <td>{row.crop}</td>
                            <td>{row.avgYield}</td>
                            <td>{row.avgArea}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default CropTable;
