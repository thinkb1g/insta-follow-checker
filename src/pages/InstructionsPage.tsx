
import React from 'react';
import Card from '../components/Card';

const InstructionStep: React.FC<{ step: number; title: string; children: React.ReactNode; imgSrc?: string }> = ({ step, title, children, imgSrc }) => (
    <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500 text-white font-bold text-xl">
            {step}
        </div>
        <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <div className="text-gray-300 space-y-2">{children}</div>
            {imgSrc && <img src={imgSrc} alt={`Step ${step} visual guide`} className="mt-4 rounded-lg shadow-lg border border-gray-700" />}
        </div>
    </div>
);

const InstructionsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <h1 className="text-3xl font-bold text-center text-white mb-2">How to Get Your Follower List</h1>
        <p className="text-center text-gray-400 mb-8">Follow these steps to download the required HTML file from Instagram.</p>

        <div className="space-y-12">
            <InstructionStep step={1} title="Navigate to Instagram and Log In">
                <p>Open your web browser on a desktop or laptop computer and go to <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">instagram.com</a>. Log in to your account.</p>
            </InstructionStep>
            
            <InstructionStep step={2} title="Go to Your Profile">
                <p>Click on your profile picture in the navigation menu to go to your profile page.</p>
            </InstructionStep>

            <InstructionStep step={3} title="Open Your 'Followers' List">
                <p>On your profile page, click on the number that shows how many followers you have. This will open a pop-up modal displaying your list of followers.</p>
            </InstructionStep>

            <InstructionStep step={4} title="Scroll to Load All Followers">
                <p>This is a crucial step. You must scroll all the way to the bottom of the follower list inside the pop-up. Keep scrolling until no more new names load. This ensures all your followers are present in the HTML.</p>
                <img src="https://picsum.photos/seed/scroll/600/300" alt="Scrolling followers list" className="mt-4 rounded-lg shadow-lg border border-gray-700" />
            </InstructionStep>
            
            <InstructionStep step={5} title="Save the Page as HTML">
                <p>With the follower list pop-up still open, right-click anywhere on the page (but outside the pop-up if possible) and select "Save As..." or "Save Page As...".</p>
                <p>In the save dialog, make sure the format is set to "Webpage, Complete" or "Webpage, HTML Only". Name the file something recognizable (e.g., `my_followers.html`) and save it to your computer.</p>
                <img src="https://picsum.photos/seed/saveas/600/300" alt="Save as dialog" className="mt-4 rounded-lg shadow-lg border border-gray-700" />
            </InstructionStep>

            <InstructionStep step={6} title="Upload the File">
                <p>You're all set! Go back to the "User" page in this app and upload the HTML file you just saved.</p>
            </InstructionStep>
        </div>
      </Card>
    </div>
  );
};

export default InstructionsPage;
