// Web Worker for handling large JSON file processing
const LARGE_FILE_THRESHOLD_BYTES = 100 * 1024 * 1024; // 100MB

self.onmessage = async function(e) {
    const file = e.data;
    
    try {
        // Check file size first
        if (file.size > LARGE_FILE_THRESHOLD_BYTES) {
            self.postMessage({
                type: 'summary',
                size: file.size,
                message: 'File is too large for full preview'
            });
            return;
        }
        
        // Read the file in chunks
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                // Parse the JSON
                const jsonString = event.target.result;
                const parsed = JSON.parse(jsonString);
                
                // Calculate some basic stats
                const stats = calculateJsonStats(parsed);
                
                // Send back success message with parsed data and stats
                self.postMessage({
                    type: 'success',
                    data: parsed,
                    stats: stats
                });
            } catch (parseError) {
                self.postMessage({
                    type: 'error',
                    error: `JSON Parse Error: ${parseError.message}`
                });
            }
        };
        
        reader.onerror = function() {
            self.postMessage({
                type: 'error',
                error: `File Read Error: ${reader.error}`
            });
        };
        
        // Start reading the file
        reader.readAsText(file);
        
    } catch (error) {
        self.postMessage({
            type: 'error',
            error: `Processing Error: ${error.message}`
        });
    }
};

// Calculate basic statistics about the JSON structure
function calculateJsonStats(obj) {
    let stats = {
        totalKeys: 0,
        maxDepth: 0,
        arrayCount: 0,
        objectCount: 0,
        valueTypes: new Set()
    };
    
    function traverse(current, depth = 0) {
        stats.maxDepth = Math.max(stats.maxDepth, depth);
        
        if (Array.isArray(current)) {
            stats.arrayCount++;
            current.forEach(item => traverse(item, depth + 1));
        } else if (current && typeof current === 'object') {
            stats.objectCount++;
            stats.totalKeys += Object.keys(current).length;
            Object.values(current).forEach(value => traverse(value, depth + 1));
        } else {
            stats.valueTypes.add(typeof current);
        }
    }
    
    traverse(obj);
    stats.valueTypes = Array.from(stats.valueTypes); // Convert Set to Array for serialization
    return stats;
}