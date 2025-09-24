const HARDCODED_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1iTARyru1Jaek-Hgt83c-2atFHbWbXBRQ7USLrnw512c/edit?usp=sharing';
const instagramIdRegex = /^[a-zA-Z0-9._]{3,30}$/;

/**
 * Stores the Google Sheet URL. This is now a no-op since the URL is hardcoded.
 */
export const saveSheetUrl = (url: string): Promise<void> => {
    return new Promise((resolve) => {
        resolve();
    });
};

/**
 * Retrieves the Google Sheet URL. Now returns the hardcoded constant.
 */
export const getSheetUrl = (): Promise<string> => {
     return new Promise((resolve) => {
        resolve(HARDCODED_SHEET_URL);
    });
}

/**
 * Fetches the target list from the configured Google Sheet URL.
 */
export const getTargetListFromSheet = async (): Promise<string[]> => {
    const url = await getSheetUrl();
    if (!url) {
        // This case should not be reached anymore with a hardcoded URL, but kept for safety.
        return [];
    }

    let csvUrl = url;
    const match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
        const sheetId = match[1];
        csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    } else if (!url.includes('export?format=csv')) {
        console.warn("URL does not look like a standard Google Sheet share link or CSV export link. Trying to fetch anyway.");
    }

    try {
        // Add a cache-busting parameter to fetch the latest version
        const fetchUrl = `${csvUrl}&t=${new Date().getTime()}`;
        const response = await fetch(fetchUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        }
        const csvText = await response.text();
        
        const ids = csvText
            .split('\n')
            .flatMap(row => row.split(','))
            .map(cell => cell.trim().replace(/"/g, '')) // Also remove quotes
            .filter(cell => instagramIdRegex.test(cell));

        return [...new Set(ids)];
    } catch (error) {
        console.error("Failed to fetch or parse Google Sheet CSV:", error);
        throw new Error("Google Sheet에서 데이터를 가져오는 데 실패했습니다. URL이 올바른지, 시트가 '웹에 게시'되었는지 확인해주세요.");
    }
};