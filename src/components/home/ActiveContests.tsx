import React from 'react';
import { Clock, Award, Users } from 'lucide-react';
import './ActiveContests.css';

// Import Contest interface from home types
import type { Contest } from '../../types/home';

interface ActiveContestsProps {
  contests: Contest[];
  onContestSelect: (id: string | number) => void;
}

const ActiveContests: React.FC<ActiveContestsProps> = ({
  contests,
  onContestSelect,
}) => {
  if (!contests?.length) return null;

  return (
    <div className="space-y-3">
      {contests.map((contest) => (
        <div 
          key={contest.id}
          className="bg-[#161B22] rounded-xl p-4 flex items-start space-x-3 cursor-pointer hover:bg-[#1F2937] transition-colors"
          onClick={() => onContestSelect(contest.id)}
        >
          <img
            src={contest.cover}
            alt={contest.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#E6EDF3] truncate">
                {contest.title}
              </h3>
              <span className="text-xs bg-[#1F6FEB] bg-opacity-20 text-[#58A6FF] px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            
            <p className="text-xs text-[#8B949E] mt-1 line-clamp-2">
              {contest.description}
            </p>
            
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center text-xs text-[#8B949E]">
                <Award className="w-3.5 h-3.5 mr-1" />
                <span>{contest.prize}</span>
              </div>
              <div className="flex items-center text-xs text-[#8B949E]">
                <Users className="w-3.5 h-3.5 mr-1" />
                <span>{contest.participants} participants</span>
              </div>
              <div className="flex items-center text-xs text-[#8B949E]">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>Ends {contest.deadline}</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center">
              <img
                src={contest.remixer.avatar}
                alt={contest.remixer.name}
                className="w-5 h-5 rounded-full mr-2"
              />
              <span className="text-xs text-[#8B949E]">
                Hosted by {contest.remixer.name}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveContests;