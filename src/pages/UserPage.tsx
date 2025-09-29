import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import ReactGA from "react-ga4";

const InstructionStep: React.FC<{ step: number; title: string; children: React.ReactNode; imgSrc?: string }> = ({ step, title, children, imgSrc }) => (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white font-bold text-lg">
            {step}
        </div>
        <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            <div className="text-gray-300 space-y-2">{children}</div>
            {imgSrc && <img src={imgSrc} alt={`Step ${step} visual guide`} className="mt-3 rounded-lg shadow-md border border-gray-700" />}
        </div>
    </div>
);


const UserPage: React.FC = () => {
  const { targetList, isLoadingList, error: contextError } = useAppContext();
  const [followerListHtml, setFollowerListHtml] = useState<File | null>(null);
  const [userOwnId, setUserOwnId] = useState('');
  const [nonMutuals, setNonMutuals] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCheck = async () => {
    ReactGA.event({
      category: "User",
      action: "click",
      label: "click compare follow button"
    });

    if (!followerListHtml) {
      setError('팔로워 리스트 HTML 파일을 업로드해주세요.');
      return;
    }
    if (isLoadingList) {
      setError('대상 목록을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (!isLoadingList && targetList.length === 0) {
        if (contextError) {
            setError(`대상 목록을 불러올 수 없습니다: ${contextError}`);
        } else {
            setError('대상 목록이 비어있습니다. 연결된 Google Sheet에 ID가 없거나, 시트를 불러올 수 없습니다.');
        }
        return;
    }
    setIsLoading(true);
    setError('');
    setNonMutuals(null);
    setCopied(false);

    try {
      const fileContent = await followerListHtml.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(fileContent, 'text/html');
      
      const links = doc.querySelectorAll('a');
      const followers = new Set<string>();
      links.forEach(link => {
        const username = link.textContent;
        if(username && !username.includes(' ') && username.length > 2) {
             followers.add(username.toLowerCase());
        }
      });
      
      if(followers.size === 0) {
        ReactGA.event({
          category: "User",
          action: "error",
          label: "followers size 0"
        });

        setError("업로드된 HTML에서 팔로워를 찾을 수 없습니다. 인스타그램에서 받은 정확한 파일인지 확인해주세요.");
        setIsLoading(false);
        return;
      }

      const ownIdLower = userOwnId.trim().toLowerCase();
      const results = targetList.filter(targetId => {
        const targetIdLower = targetId.toLowerCase();
        return targetIdLower !== ownIdLower && !followers.has(targetIdLower);
      });

      setNonMutuals(results);

      ReactGA.event({
        category: "User",
        action: "success",
        label: "successful list comparison"
      });
      
    } catch (e) {
      console.error(e);
      setError('HTML 파일을 분석하는 중 오류가 발생했습니다. 유효한 파일인지 확인해주세요.');
      ReactGA.event({
        category: "User",
        action: "error",
        label: "html parsing error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (nonMutuals && nonMutuals.length > 0) {
      const resultText = `
맞팔하지 않는 계정:
${nonMutuals.join('\n')}

InstaFollow Checker로 확인
      `.trim();
      navigator.clipboard.writeText(resultText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card>
        <h1 className="text-3xl font-bold text-center text-white mb-2">팔로워 맞팔 체크</h1>
        <p className="text-center text-gray-400 mb-6">팔로워 리스트를 업로드하고, 대상 목록 중에서 누가 맞팔하지 않았는지 확인하세요.</p>
        
        <div className="space-y-6">
          <details className="bg-gray-900 border border-gray-700 rounded-lg p-4 cursor-pointer group">
            <summary className="font-semibold text-lg text-indigo-400 list-none flex justify-between items-center">
              팔로워 리스트 파일은 어떻게 받나요?
              <svg className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </summary>
            <div className="mt-6 space-y-8 border-t border-gray-700 pt-6">
              <InstructionStep step={1} title="프로필 및 메뉴 접근">
                <p>인스타그램 내 프로필 &gt; 우상단 메뉴 클릭</p>
              </InstructionStep>
              <InstructionStep step={2} title="계정 센터 진입">
                <p>내 계정 &gt; 계정센터 &gt; 내 정보 및 권한 진입</p>
              </InstructionStep>
              <InstructionStep step={3} title="정보 내보내기">
                <p>내 정보 내보내기</p>
              </InstructionStep>
              <InstructionStep step={4} title="내보내기 만들기">
                <p>내보내기 만들기 버튼 클릭 후, 내보낼 계정 선택</p>
              </InstructionStep>
              <InstructionStep step={5} title="내보내기 방식 선택">
                <p>기기로 내보내기</p>
              </InstructionStep>
              <InstructionStep step={6} title="설정값 수정">
                <ul className="list-disc list-inside space-y-1">
                  <li><b>정보 맞춤 설정:</b> 체크박스 모두 지우고 '연결활동 &gt; 팔로워 및 팔로잉'만 체크된 상태로 저장</li>
                  <li><b>기간:</b> 전체기간 선택</li>
                </ul>
              </InstructionStep>
              <InstructionStep step={7} title="내보내기 시작">
                <p>내보내기 시작</p>
              </InstructionStep>
              <InstructionStep step={8} title="파일 다운로드">
                <p>완료되면 다운로드 버튼 활성화 되어 파일 내려 받으면 됨</p>
              </InstructionStep>
              <InstructionStep step={9} title="HTML 파일 확인">
                <p>압축 풀고 connections 파일 내에서 followers_번호.html로 생성된 파일 확인</p>
              </InstructionStep>
              <InstructionStep step={10} title="파일 업로드">
                <p>해당 파일을 웹페이지에 업로드하면 됩니다.</p>
              </InstructionStep>
            </div>
          </details>

          <FileUpload 
            onFileUpload={setFollowerListHtml} 
            accept=".html"
            title="팔로워 리스트 업로드"
            description="인스타그램 데이터에서 받은 HTML 파일"
          />

          <div>
            <label htmlFor="instaId" className="block text-sm font-medium text-gray-300">
              내 인스타그램 ID
            </label>
            <input
              type="text"
              name="instaId"
              id="instaId"
              value={userOwnId}
              onChange={(e) => setUserOwnId(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="내 인스타그램 ID 입력"
            />
             <p className="mt-2 text-xs text-gray-500">결과에서 본인을 제외하기 위해 필요합니다.</p>
          </div>

          <Button onClick={handleCheck} isLoading={isLoading || isLoadingList} disabled={!followerListHtml} className="w-full">
            {isLoadingList ? '대상 목록 로딩중...' : '맞팔 확인하기'}
          </Button>
          
          {error && <p className="text-red-400 text-center">{error}</p>}
        </div>
      </Card>

      {nonMutuals !== null && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">결과</h2>
            {nonMutuals.length > 0 && (
                <button 
                  onClick={handleCopyToClipboard}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
                >
                  {copied ? '복사됨!' : '결과 복사'}
                </button>
            )}
          </div>
          {nonMutuals.length === 0 ? (
            <p className="text-green-400 text-center py-4">✅ 대상 목록의 모든 계정이 나를 팔로우하고 있습니다!</p>
          ) : (
            <div>
              <p className="text-yellow-400 mb-4 text-center">
                나를 팔로우하지 않는 계정 {nonMutuals.length}개를 찾았습니다.
              </p>
              <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {nonMutuals.map((id) => (
                  <li key={id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                    <span className="font-mono text-gray-200">{id}</span>
                    <a
                      href={`https://www.instagram.com/${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                    >
                      프로필 방문 &rarr;
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default UserPage;