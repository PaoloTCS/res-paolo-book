import React, { useState } from 'react';

const PDFConverter = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [bookData, setBookData] = useState(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        // Initialize empty book data structure
        setBookData({
            chapters: []
        });
    };

    const addChapter = () => {
        setBookData(prev => ({
            ...prev,
            chapters: [...prev.chapters, {
                id: prev.chapters.length + 1,
                title: "",
                tips: []
            }]
        }));
    };

    const addTip = (chapterIndex) => {
        const newBookData = {...bookData};
        newBookData.chapters[chapterIndex].tips.push({
            id: `${chapterIndex + 1}.${newBookData.chapters[chapterIndex].tips.length + 1}`,
            title: "",
            content: []
        });
        setBookData(newBookData);
    };

    const addContent = (chapterIndex, tipIndex) => {
        const newBookData = {...bookData};
        newBookData.chapters[chapterIndex].tips[tipIndex].content.push({
            id: `${chapterIndex + 1}.${tipIndex + 1}.${newBookData.chapters[chapterIndex].tips[tipIndex].content.length + 1}`,
            type: "key_point",
            text: ""
        });
        setBookData(newBookData);
    };

    const updateTitle = (chapterIndex, value) => {
        const newBookData = {...bookData};
        newBookData.chapters[chapterIndex].title = value;
        setBookData(newBookData);
    };

    const updateTipTitle = (chapterIndex, tipIndex, value) => {
        const newBookData = {...bookData};
        newBookData.chapters[chapterIndex].tips[tipIndex].title = value;
        setBookData(newBookData);
    };

    const updateContent = (chapterIndex, tipIndex, contentIndex, value) => {
        const newBookData = {...bookData};
        newBookData.chapters[chapterIndex].tips[tipIndex].content[contentIndex].text = value;
        setBookData(newBookData);
    };

    const downloadJSON = () => {
        const jsonStr = JSON.stringify(bookData, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = "processed_book_data.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="mb-4"
                />
            </div>

            {bookData && (
                <div>
                    <button 
                        onClick={addChapter}
                        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                    >
                        Add Chapter
                    </button>

                    {bookData.chapters.map((chapter, chapterIndex) => (
                        <div key={chapter.id} className="mb-6 border p-4 rounded">
                            <input
                                value={chapter.title}
                                onChange={(e) => updateTitle(chapterIndex, e.target.value)}
                                placeholder="Chapter Title"
                                className="w-full p-2 mb-2 border rounded"
                            />

                            <button 
                                onClick={() => addTip(chapterIndex)}
                                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                            >
                                Add Tip
                            </button>

                            {chapter.tips.map((tip, tipIndex) => (
                                <div key={tip.id} className="ml-4 mb-4 border-l-2 pl-4">
                                    <input
                                        value={tip.title}
                                        onChange={(e) => updateTipTitle(chapterIndex, tipIndex, e.target.value)}
                                        placeholder="Tip Title"
                                        className="w-full p-2 mb-2 border rounded"
                                    />

                                    <button 
                                        onClick={() => addContent(chapterIndex, tipIndex)}
                                        className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
                                    >
                                        Add Content
                                    </button>

                                    {tip.content.map((content, contentIndex) => (
                                        <div key={content.id} className="ml-4 mb-2">
                                            <input
                                                value={content.text}
                                                onChange={(e) => updateContent(chapterIndex, tipIndex, contentIndex, e.target.value)}
                                                placeholder="Content Text"
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}

                    <button 
                        onClick={downloadJSON}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Download JSON
                    </button>
                </div>
            )}
        </div>
    );
};

export default PDFConverter;