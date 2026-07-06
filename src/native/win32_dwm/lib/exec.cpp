/*
   Copyright 2020 AryToNeX

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
#include "dwm.cpp"
#include <cstdlib>
#include <string>

int main(int argc, char **argv){
    if (argc < 2)
		return 2;

    const std::string command = argv[1];
    if (command == "swca") {
        if (argc < 5)
            return 2;

        return swca(
            (HWND) std::stoull(argv[2]),
            std::atoi(argv[3]),
            std::atoi(argv[4])
        );
    }

    if (command == "backdrop") {
        if (argc < 4)
            return 2;

        return set_system_backdrop_type(
            (HWND) std::stoull(argv[2]),
            std::atoi(argv[3])
        );
    }

    return 2;
}
