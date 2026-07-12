// 1. Logic สร้าง Series แบบ Dynamic (ซ่อนตัวที่เป็น 0)
function buildDynamicSeries(planData, gridIndex = 0) {
    const seriesList = [];
    const legendList = [];
    const hasData = (arr) => arr && arr.some(val => val > 0);

    if (hasData(planData.cv)) {
        seriesList.push({
            name: 'มูลค่ารับซื้อคืนหน่วยลงทุน (CV)', type: 'bar',
            gridIndex: gridIndex, xAxisIndex: gridIndex, yAxisIndex: gridIndex,
            data: planData.cv, barWidth: '35%',
            itemStyle: { color: '#475569', borderRadius: [3, 3, 0, 0] }
        });
        legendList.push('มูลค่ารับซื้อคืนหน่วยลงทุน (CV)');
    }

    if (hasData(planData.db)) {
        seriesList.push({
            name: 'ผลประโยชน์กรณีเสียชีวิต (DB)', type: 'line',
            gridIndex: gridIndex, xAxisIndex: gridIndex, yAxisIndex: gridIndex,
            data: planData.db, smooth: true,
            lineStyle: { color: '#8c734b', width: 3 }, itemStyle: { color: '#8c734b' }
        });
        legendList.push('ผลประโยชน์กรณีเสียชีวิต (DB)');
    }

    if (hasData(planData.cumPremium)) {
        seriesList.push({
            name: 'เบี้ยสะสม', type: 'line',
            gridIndex: gridIndex, xAxisIndex: gridIndex, yAxisIndex: gridIndex,
            data: planData.cumPremium, smooth: true,
            lineStyle: { color: '#10b981', width: 2, type: 'dashed' }, itemStyle: { color: '#10b981' }
        });
        legendList.push('เบี้ยสะสม');
    }

    if (hasData(planData.cumFees)) {
        seriesList.push({
            name: 'ค่าธรรมเนียมกรมธรรม์สะสม', type: 'line',
            gridIndex: gridIndex, xAxisIndex: gridIndex, yAxisIndex: gridIndex,
            data: planData.cumFees, smooth: true, showSymbol: false,
            areaStyle: { color: 'rgba(244, 63, 94, 0.25)' },
            lineStyle: { color: '#f43f5e', width: 1.5 }, itemStyle: { color: '#f43f5e' }
        });
        legendList.push('ค่าธรรมเนียมกรมธรรม์สะสม');
    }

    if (hasData(planData.autoRedeem)) {
        seriesList.push({
            name: 'เงินสะสม Auto Redemption', type: 'line',
            gridIndex: gridIndex, xAxisIndex: gridIndex, yAxisIndex: gridIndex,
            data: planData.autoRedeem, smooth: true, showSymbol: false,
            areaStyle: { color: 'rgba(56, 189, 248, 0.25)' },
            lineStyle: { color: '#38bdf8', width: 2, type: 'dashed' }, itemStyle: { color: '#38bdf8' }
        });
        legendList.push('เงินสะสม Auto Redemption');
    }

    return { seriesList, legendList };
}

// 2. Logic สกัดและกรองอายุแกน X สำหรับ Compare View (คิดจากปีกรมธรรม์ + เรียงจากน้อยไปมาก)
function getCompareXAxisAges(masterData) {
    const totalYears = masterData.length;
    
    return masterData
        .filter((row, index) => {
            const y = row.year;
            
            // ปีที่บังคับแสดงเสมอ
            const isFirstYear = (index === 0 || y === 1);
            const isLastYear  = (index === totalYears - 1);
            const isDivBy10   = (y % 10 === 0);
            
            // ปีที่หาร 5 ลงตัว (แสดงเฉพาะเมื่อมีข้อมูล)
            const isDivBy5    = (y % 5 === 0 && y % 10 !== 0);
            const hasDataInYear = (row.cv > 0 || row.db > 0 || row.cumPremium > 0 || row.autoRedeem > 0);
            
            return isFirstYear || isLastYear || isDivBy10 || (isDivBy5 && hasDataInYear);
        })
        .sort((a, b) => a.age - b.age) // เรียงลำดับอายุจากน้อยไปมาก
        .map(row => `อายุ ${row.age}`);
}

// 3. Logic สกัดอายุแกน X สำหรับ Individual View (แสดงทุกปี + เรียงจากน้อยไปมาก)
function getIndividualXAxisAges(masterData) {
    return masterData
        .sort((a, b) => a.age - b.age) // เรียงลำดับอายุจากน้อยไปมาก
        .map(row => `อายุ ${row.age}`);
}