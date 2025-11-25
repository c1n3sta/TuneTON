# Production Database Schema

This document provides detailed information about the production database schema for the TuneTON application.

## Database Connection Information
- **Host**: aws-1-ap-south-1.pooler.supabase.com
- **Port**: 5432
- **Database**: postgres
- **Schema**: public
- **Total Tables**: 34

## Deployed Edge Functions
1. telegram-auth (ACTIVE)
2. tracks (ACTIVE)
3. playbacks (ACTIVE)
4. health (ACTIVE)
5. jamendo-proxy (ACTIVE)
6. hello (ACTIVE)
7. make-server-82f19583 (ACTIVE)
8. telegram-auth-test (ACTIVE)
9. test (ACTIVE)
10. test-db-schema (ACTIVE)
11. telegram-auth-test-hash (ACTIVE)

## Database Tables (34 total)

The following is a list of all tables in the public schema of the production database:

1. albums
2. app_config
3. artists
4. audio_presets
5. comments
6. community_posts
7. content_reports
8. contest_entries
9. contest_votes
10. contests
11. kv_store_82f19583
12. music_tracks
13. nft_collections
14. nft_transactions
15. nfts
16. platform_metrics
17. playback_history
18. playbacks
19. playlist_tracks
20. playlists
21. remixes
22. social_interactions
23. stars_transactions
24. ton_transactions
25. tracks
26. user_achievements
27. user_activities
28. user_favorite_artists
29. user_follows
30. user_library
31. user_recent_tracks
32. user_sessions
33. user_wallets
34. users

## Verification Status
- ✅ Successfully connected to remote Supabase database
- ✅ Authentication with service role key verified
- ✅ All 34 tables in public schema identified
- ✅ All 11 edge functions identified and verified