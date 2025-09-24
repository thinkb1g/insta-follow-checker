import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';

const ADMIN_PASSWORD = '8888';
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1iTARyru1Jaek-Hgt83c-2atFHbWbXBRQ7USLrnw512c/edit?usp=sharing';


const AdminPage: React.FC = () => {
  const { isAdminLoggedIn, loginAdmin, targetList, isLoadingList, error: contextError, refetchList } = useAppContext();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      loginAdmin();
      setLoginError('');
    } else {
      setLoginError('잘못된 비밀번호입니다.');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchList();
    setIsRefreshing(false);
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <form onSubmit={handleLogin} className="space-y-6">
            <h1 className="text-2xl font-bold text-center text-white">관리자 로그인</h1>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>
            {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
            <div>
              <Button type="submit" className="w-full">로그인</Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
     <div className="max-w-2xl mx-auto space-y-8">
        <Card>
            <h1 className="text-3xl font-bold text-center text-white mb-6">관리자 대시보드</h1>
            <div className="space-y-4 text-center">
                <p className="text-gray-300">현재 대상 리스트는 아래 Google 스프레드시트에서 가져옵니다.</p>
                <a 
                  href={SPREADSHEET_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-mono text-indigo-400 break-all hover:underline"
                >
                  {SPREADSHEET_URL}
                </a>
                 <div className="pt-4">
                    <Button onClick={handleRefresh} isLoading={isRefreshing || isLoadingList}>
                        {isLoadingList && !isRefreshing ? '로딩중...' : '리스트 새로고침'}
                    </Button>
                 </div>
            </div>
        </Card>
        <Card>
            <h2 className="text-2xl font-bold text-white mb-4">현재 대상 리스트</h2>
            {isLoadingList ? (
               <p className="text-gray-400">리스트를 불러오는 중...</p>
            ) : contextError ? (
               <p className="text-red-400">리스트를 불러오지 못했습니다: {contextError}</p>
            ) : targetList.length > 0 ? (
                <>
                    <p className="text-gray-400 mb-4">현재 {targetList.length}개의 ID가 저장되어 있습니다.</p>
                    <ul className="space-y-2 max-h-64 overflow-y-auto bg-gray-900 p-3 rounded-md">
                        {targetList.slice(0, 100).map(id => <li key={id} className="font-mono text-sm text-gray-300">{id}</li>)}
                        {targetList.length > 100 && <li className="text-sm text-gray-500">... 외 {targetList.length-100}개</li>}
                    </ul>
                </>
            ) : (
                <p className="text-gray-500">대상 리스트가 비어있습니다. 연결된 Google Sheet를 확인해주세요.</p>
            )}
        </Card>
     </div>
  );
};

export default AdminPage;