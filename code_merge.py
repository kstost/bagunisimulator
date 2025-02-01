#!/usr/bin/env python3
import os
import sys
import re
import fnmatch

def load_ignore_patterns(ignore_file):
    """예외목록파일(예: .gitignore)을 읽어, 무시할 패턴 목록을 반환한다."""
    patterns = []
    try:
        with open(ignore_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                # 빈 줄이나 주석(#)은 건너뛴다.
                if not line or line.startswith("#"):
                    continue
                patterns.append(line)
    except Exception as e:
        print(f"예외목록파일을 읽는 중 에러 발생: {e}")
    return patterns

def should_ignore(rel_path, ignore_patterns):
    """
    파일의 상대 경로(rel_path)가 ignore_patterns에 해당하면 True를 반환한다.
    간단한 fnmatch를 사용해 패턴 매칭을 수행한다.
    """
    for pattern in ignore_patterns:
        # 패턴이 디렉토리용으로 "디렉토리명/" 형태라면,
        # rel_path가 해당 패턴으로 시작하는지 확인한다.
        if pattern.endswith("/") and rel_path.startswith(pattern):
            return True
        # 그 외에는 fnmatch로 비교
        if fnmatch.fnmatch(rel_path, pattern):
            return True
    return False

def choose_fence(content):
    """
    content 내부에 있는 연속된 backtick의 최대 길이를 찾고,
    외부에 사용할 fenced code block의 fence를 결정한다.
    만약 내용 중 backtick이 없으면 기본 3개("```")를 사용하고,
    있다면 그보다 1개 더 많은 backtick을 사용하여 중복을 피한다.
    """
    matches = re.findall(r'(`+)', content)
    if matches:
        max_count = max(len(m) for m in matches)
    else:
        max_count = 0
    fence_count = max(3, max_count + 1)
    return "`" * fence_count

def merge_codes(base_folder, result_file, ignore_patterns):
    """
    base_folder 내의 모든 파일을 재귀적으로 탐색하여,
    각 파일의 상대 경로와 내용을 마크다운 형식으로 result_file에 저장한다.
    """
    merged_items = []
    # base_folder 경로를 정규화 (끝에 슬래시 제거)
    base_folder = os.path.abspath(base_folder)
    for root, dirs, files in os.walk(base_folder):
        for file in files:
            abs_path = os.path.join(root, file)
            # base_folder에 대한 상대 경로 (유닉스 스타일로 변환)
            rel_path = os.path.relpath(abs_path, base_folder).replace(os.sep, '/')
            # 출력 파일 예시에는 파일경로 앞에 "./"를 붙임
            display_path = "./" + rel_path
            if ignore_patterns and should_ignore(rel_path, ignore_patterns):
                continue
            merged_items.append((display_path, abs_path))
    
    # 결과 파일에 기록
    with open(result_file, "w", encoding="utf-8") as out:
        # 경로순 정렬 (선택사항)
        for display_path, abs_path in sorted(merged_items, key=lambda x: x[0]):
            out.write(f"{display_path}:\n")
            try:
                with open(abs_path, "r", encoding="utf-8") as f:
                    content = f.read()
            except Exception as e:
                content = f"파일을 읽는 중 에러 발생: {e}"
            fence = choose_fence(content)
            out.write(f"{fence}\n")
            out.write(content)
            # 내용 마지막에 newline이 없다면 추가
            if not content.endswith("\n"):
                out.write("\n")
            out.write(f"{fence}\n\n")

def main():
    if len(sys.argv) < 3:
        print("Usage: python code_merge.py [폴더경로] [결과파일] [예외목록파일:optional]")
        print("example: python code_merge.py ./project/ ./merged.md ./.gitignore")
        sys.exit(1)
    
    folder_path = sys.argv[1]
    result_file = sys.argv[2]
    
    ignore_patterns = []
    if len(sys.argv) >= 4:
        ignore_file = sys.argv[3]
        ignore_patterns = load_ignore_patterns(ignore_file)
    
    merge_codes(folder_path, result_file, ignore_patterns)
    print(f"코드 병합이 완료되었습니다. 결과파일: {result_file}")

if __name__ == "__main__":
    main()
