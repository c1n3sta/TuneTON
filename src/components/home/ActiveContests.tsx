import React from 'react';
import './ActiveContests.css';

// Define the Contest interface locally since we're not importing it from HomeScreen
interface Contest {
  id: number;
  title: string;
  cover: string;
  prize: string;
  participants: number;
  remixer?: {
    name: string;
    avatar?: string;
  };
}

type ActiveContestsProps = {
  contests: Contest[];
};

const ActiveContests: React.FC<ActiveContestsProps> = ({ contests }) => {
  if (!contests?.length) return null;

  return (
    <section className="active-contests">
      <div className="section-header">
        <h2>Active Contests</h2>
        <button className="see-all">See All</button>
      </div>
      
      <div className="contest-list">
        {contests.map((contest) => (
          <div key={contest.id} className="contest-card">
            <div className="contest-cover">
              <img 
                src={contest.cover} 
                alt={contest.title}
                loading="lazy"
              />
            </div>
            <div className="contest-details">
              <h3>{contest.title}</h3>
              <p className="prize">Prize: {contest.prize}</p>
              <div className="contest-meta">
                {contest.remixer && (
                  <div className="remixer">
                    <div className="remixer-avatar">
                      {contest.remixer.avatar ? (
                        <img 
                          src={contest.remixer.avatar} 
                          alt={contest.remixer.name}
                          loading="lazy"
                        />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <span className="participants">{contest.participants} participants</span>
                  </div>
                )}
              </div>
            </div>
            <button 
              className="join-button"
              aria-label="Join contest"
            >
              +
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActiveContests;
