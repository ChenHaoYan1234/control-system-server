cmake_minimum_required(VERSION 4.2.0)

project(control-system-server LANGUAGES CXX)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS ON)

include($ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake)

find_package(httplib CONFIG REQUIRED)
find_package(bsoncxx CONFIG REQUIRED)
find_package(mongocxx CONFIG REQUIRED)

add_executable(control-system-server src/main.cc)

target_link_libraries(control-system-server PRIVATE httplib::httplib)
target_link_libraries(control-system-server PRIVATE $<IF:$<TARGET_EXISTS:mongo::bsoncxx_static>,mongo::bsoncxx_static,mongo::bsoncxx_shared>)
target_link_libraries(control-system-server PRIVATE $<IF:$<TARGET_EXISTS:mongo::mongocxx_static>,mongo::mongocxx_static,mongo::mongocxx_shared>)
