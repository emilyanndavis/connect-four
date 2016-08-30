angular.module('con4', [])
	.controller('GameController', function($scope){

		this.$onInit = function(){
			$scope.newGame();
		}
		
		$scope.newGame = function(){
			 $scope.victory = false;
			 $scope.grid = buildGrid();
			 // This is connect 4 so red plays first
			 $scope.activePlayer = 'red';
		}
		
		function buildGrid(){
			var grid = [];
			for (var r = 0; r < 6; r++) {
				var row = [];
				for (var c = 0; c < 7; c++){
					row.push({row: r, col: c});
				}
				grid.push(row);
			}
			return grid;
		}
		
		$scope.dropToken = function(col){
			//Column is full no space available
			if($scope.victory || $scope.grid[0][col].hasToken){
				return;
			}
			
			//Find the southMost unoccupied row
			/**
			 * Always start at row 0 and then increment
			 * until you have reached the final row or 
			 * found a cell that already has a token
			 */
			var row = checkSouth(0, col);

			/**
			 * Once the row is identified
			 * set the cell by accessing 
			 * $scope.grid[row][col]
			 * set cell.hasToken = true
			 * set cell.color $scope.activePlayer
			 **/  
			var cell = $scope.grid[row][col];
			cell.hasToken = true;
			cell.color = $scope.activePlayer;
			
			//endTurn and checkVictory
			checkVictory(cell);
			endTurn();
		}
		
		function checkSouth(row, col){
		/**
		 * Let's use recursion
		 * A recursive function is...
		 * a function that calls itself
		 * until some condition is met
		 * 
		 * Check South will need essentially two base cases
		 * 
		 */
			
			//Base case 1 found south Token return row - 1 to go back one step
			if ($scope.grid[row][col].hasToken) {
				return row - 1;
			} 
			
			//base case 2 reached bottom of grid return row or 5
			if (row === $scope.grid.length - 1) {
				return row;
			}
			
			/**
			 * if neither base case 
			 * (***increment row***, then return checkSouth())
			 * make sure to pass the arguments through
			 */
			return checkSouth(row + 1, col);

		}
		
		function checkVictory(cell){
			//This one is a gimme you shouldn't have to change anything here
			//Once you fix the checkNextCell function the green squiggles should dissapear.
			//If they don't make sure you are returning a number from the checkNextCell function
			
			var horizontalMatches = 0;
			//Check Horizontal
			horizontalMatches += checkNextCell(cell, 0, 'left');
			horizontalMatches += checkNextCell(cell, 0, 'right');
			
			//Check Vertical
			var verticalMatches = 0;
			verticalMatches += checkNextCell(cell, 0, 'down');
			
			//Check Diag LeftUp and RightDown
			var diagLeft = 0;
			diagLeft += checkNextCell(cell, 0, 'diagUpLeft');
			diagLeft += checkNextCell(cell, 0, 'diagDownRight');
			
			//Check Diag RightUp and LeftDown
			var diagRight = 0;
			diagRight += checkNextCell(cell, 0, 'diagUpRight');
			diagRight += checkNextCell(cell, 0, 'diagDownLeft');
			
			if(verticalMatches >= 3 || horizontalMatches >= 3 || diagLeft >= 3 || diagRight >= 3){
				//You can do better than an alert 
				$scope.victory = true;
				$scope.victor = cell.color;
			}
		}
		
		function getNextCell(cell, direction){

			var nextRow = cell.row;
			var nextCol = cell.col;

			switch (direction) {
				case 'down':
					nextRow += 1;
					break;
				case 'diagDownRight':
					nextRow += 1;
					nextCol += 1;
					break;
				case 'diagDownLeft':
					nextRow += 1;
					nextCol -= 1;
					break;			
				case 'right':
					nextCol += 1;
					break;
				case 'diagUpRight':
					nextRow -= 1;
					nextCol += 1;
					break;
				case 'left':
					nextCol -= 1;
					break;
				case 'diagUpLeft':
					nextRow -= 1;
					nextCol -= 1;
					break;
			}

			if (nextRow < 0 || nextRow > $scope.grid.length - 1 || nextCol > $scope.grid[0].length - 1) {
				return null;
			}

			// console.log({direction: direction, row: $scope.grid[nextRow][nextCol].row, col: $scope.grid[nextRow][nextCol].col});			
			return $scope.grid[nextRow][nextCol];

		}
		
		function checkNextCell(cell, matches, direction){
			
			 var nextCell = getNextCell(cell, direction);

			 if (nextCell && nextCell.hasToken && nextCell.color === cell.color) {
				 matches++;
				 return checkNextCell(nextCell, matches, direction);
			 }
			 return matches;
			 		
		}
		
		function endTurn(){

			if ($scope.activePlayer == 'red') {
				$scope.activePlayer = 'black';
			} else if ($scope.activePlayer == 'black') {
				$scope.activePlayer = 'red';
			}
		}
	});